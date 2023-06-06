import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearFilters, generalFiltrationDrugs, selectDrugState } from '../../store/drugSlice';
import { IFilterProps } from './Filter.props';
import styles from './Filter.module.scss';

const Filter = ({ title, filterListLength, addFilterListFunc }: IFilterProps): JSX.Element => {
	const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]); // список чекнутых пунктов
	const [showFilter, setShowFilter] = useState<boolean>(window.innerWidth > 845 ? true : false); // показ развернутого фильтра (на экранах меньше 845px - свернут по умолчанию)
	const dispatch = useAppDispatch();
	const drugState = useAppSelector(selectDrugState); // весь state
	const { register, reset } = useForm(); // регистрация и сброс от useForm
	const itemsListForFilter: string[] = []; // список пунктов для фильтрации;

	// следит за списком чекнутых пунктов
	useEffect(() => {
		// если этот список и список других фильтров пустой, статус фильтрации - в работе, то очищаем фильтры
		if (checkboxFilter.length === 0 && filterListLength === 0 && drugState.filterStatus) dispatch(clearFilters());
		// иначе если список имеет хотя бы одну запись или другие списки не пустые
		else if (checkboxFilter.length > 0 || filterListLength > 0) {
			dispatch(addFilterListFunc(checkboxFilter)); // добавляем в store список для фильтрации
			dispatch(generalFiltrationDrugs()); // фильтруем
		}
	}, [checkboxFilter, dispatch]);

	// следит за статусом работы фильтрации
	useEffect(() => {
		!drugState.filterStatus && checkboxFilter.length > 0 && resetHandler(); // если фильтрация НЕ в работе и остались чекнутые пункты - обнуляем форму
	}, [drugState.filterStatus]);

	// обработчик изменения чекбокса
	const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
		// если инпут чекнулся - добавляем в список чекнутых пунктов
		if (e.target.checked) setCheckboxFilter(prevState => [...prevState, e.target.id]);
		// иначе убираем его из этого списка
		else setCheckboxFilter(prevState => prevState.filter(actionName => actionName !== e.target.id));
	};

	// обработчик сброса формы
	const resetHandler = () => {
		reset(); // форма обнуляется
		setCheckboxFilter([]); // список чекнутых пунктов обнуляется
		drugState.filterStatus && dispatch(clearFilters()); // если фильтр в работе - очищаем фильтры из state
	};

	// в потоке перебираем список лекарст по поиску и добавляем в список пунктов для фильтрации не повторяющиеся пункты из всех лекарств
	drugState.drugListSearch.forEach(drug => {
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

				{drugState.drugListSearch.length === 0 && drugState.fetchStatus === 'idle' && <div>не найдено</div>}
				{itemsListForFilter.sort().map(item => (
					<li key={item} className={styles.formFiltersItem}>
						<label className={styles.formFiltersLabel}>
							<input type="checkbox" id={item} {...register('action', { onChange: (e) => changeHandler(e) })} />
							{item.toLowerCase()}
						</label>
					</li>
				))}

			</ul>
		</form>
	);
};

export default Filter;
