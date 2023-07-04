import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearFilterList, selectFetchStatus, selectVisibleDrugs } from '../../store/drugSlice';
import { IFilterProps } from './Filter.props';
import styles from './Filter.module.scss';

const Filter = ({ title, thisFilterListLength, otherFilterListLength, addFilterListFunc }: IFilterProps): JSX.Element => {
	const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]); // список чекнутых пунктов
	const [showFilter, setShowFilter] = useState<boolean>(window.innerWidth > 845 ? true : false); // показ развернутого фильтра (на экранах меньше 845px - свернут по умолчанию)

	const dispatch = useAppDispatch();
	const fetchStatus = useAppSelector(selectFetchStatus); // store - статус загрузки лекарств
	const visibleDrugs = useAppSelector(state => selectVisibleDrugs(state, true)); // store - фильтрованный список лекарств

	const { register, reset } = useForm({ defaultValues: { filter: [''] } }); // регистрация и сброс от useForm
	const itemsListForFilter: string[] = []; // список пунктов для фильтрации;

	// следим за списком чекнутых пунктов
	useEffect(() => {
		// если этот список (state) и список других фильтров пустой и этот список в store не пустой, то очищаем фильтры
		if (checkboxFilter.length === 0 && otherFilterListLength === 0 && thisFilterListLength > 0) dispatch(clearFilterList()); // добавить еще условие по всем нулям?????????
		// если список (state) имеет хотя бы одну запись или другие списки не пустые, то добавляем в store список для фильтрации
		if (checkboxFilter.length > 0 || otherFilterListLength > 0) dispatch(addFilterListFunc(checkboxFilter));
	}, [checkboxFilter, dispatch]);

	// следим за списками пунктов фильтрации в store (для кнопки очистки фильтров)
	useEffect(() => {
		thisFilterListLength === 0 && otherFilterListLength === 0 && checkboxFilter.length > 0 && resetHandler(); // если списки фильтров пустые и остались чекнутые пункты - обнуляем форму
	}, [thisFilterListLength, otherFilterListLength]);

	// обработчик изменения чекбокса
	const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
		// если инпут чекнулся - добавляем в список чекнутых пунктов
		if (e.target.checked) setCheckboxFilter(prevState => [...prevState, e.target.id]);
		// иначе убираем его из этого списка
		else setCheckboxFilter(prevState => prevState.filter(filterName => filterName !== e.target.id));
	};

	// обработчик сброса формы
	const resetHandler = () => {
		reset(); // форма обнуляется
		setCheckboxFilter([]); // список чекнутых пунктов обнуляется
	};

	// в потоке перебираем список лекарст по поиску и добавляем в список пунктов для фильтрации не повторяющиеся пункты из всех лекарств
	visibleDrugs.forEach(drug => {
		if (title === 'Действие') {
			drug.categories.forEach(category => {
				if (!itemsListForFilter.includes(category)) {
					itemsListForFilter.push(category);
				}
			});
		} else if (title === 'Тип') {
			if (!itemsListForFilter.includes(drug.type)) {
				itemsListForFilter.push(drug.type);
			}
		}
	});

	return (
		<form className={styles.form}>
			<h4 className={styles.formTitle} onClick={() => setShowFilter(prev => !prev)}>
				{title}
				<FontAwesomeIcon icon={showFilter ? faCaretUp : faCaretDown} />
			</h4>
			<ul className={showFilter ? styles.formFiltersList : styles.formFiltersListDisplayNone}>

				{visibleDrugs.length === 0 && fetchStatus === 'idle' && <p>Не найдено</p>}
				{itemsListForFilter
					.sort((a, b) => {
						if (checkboxFilter.includes(a) && !checkboxFilter.includes(b)) return -1;
						else if (!checkboxFilter.includes(a) && checkboxFilter.includes(b)) return 1;
						else if ((checkboxFilter.includes(a) && checkboxFilter.includes(b) || !checkboxFilter.includes(a) && !checkboxFilter.includes(b)) && a > b) return 1;
						else if ((checkboxFilter.includes(a) && checkboxFilter.includes(b) || !checkboxFilter.includes(a) && !checkboxFilter.includes(b)) && a < b) return -1;
						else return 0
					})
					.map(item => (
						<li key={item} className={styles.formFiltersItem}>
							<label className={styles.formFiltersLabel}>
								<input type="checkbox" id={item} {...register('filter', { onChange: (e) => changeHandler(e) })} />
								{item.toLowerCase()}
							</label>
						</li>
					))}

			</ul>
		</form>
	);
};

export default Filter;
