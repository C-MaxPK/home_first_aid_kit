import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFilterListByAction, clearFilters, generalFiltrationDrugs, selectDrugState } from '../../store/drugSlice';
import styles from './FilterByAction.module.scss';

const FilterByAction = (/* {  }: IFilterByActionProps */): JSX.Element => {
	const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]); // список чекнутых категорий
	const [showFilter, setShowFilter] = useState<boolean>(true); // показ развернутого фильтра
	const dispatch = useAppDispatch();
	const drugState = useAppSelector(selectDrugState); // весь state
	const { register, reset } = useForm(); // регистрация и сброс от useForm
	const categorySort: string[] = []; // список категорий для фильтрации;

	// следит за списком чекнутых категорий
	useEffect(() => {
		// если этот список и список других фильтров пустой, статус фильтрации - в работе, то очищаем фильтры
		if (checkboxFilter.length === 0 && drugState.filterList.type.length === 0 && drugState.filterStatus) dispatch(clearFilters());
		// иначе если список имеет хотя бы одну запись или другие списки не пустые
		else if (checkboxFilter.length > 0 || drugState.filterList.type.length > 0) {
			dispatch(addFilterListByAction(checkboxFilter)); // добавляем в store список для фильтрации
			dispatch(generalFiltrationDrugs()); // фильтруем
		}
	}, [checkboxFilter, dispatch]);

	// следит за статусом работы фильтрации
	useEffect(() => {
		!drugState.filterStatus && checkboxFilter.length > 0 && resetHandler(); // если фильтрация НЕ в работе и остались чекнутые категории - обнуляем форму
	}, [drugState.filterStatus]);

	// обработчик изменения чекбокса
	const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
		// если инпут чекнулся - добавляем в список чекнутых категорий
		if (e.target.checked) setCheckboxFilter(prevState => [...prevState, e.target.id]);
		// иначе убираем его из этого списка
		else setCheckboxFilter(prevState => prevState.filter(actionName => actionName !== e.target.id));
	};

	// обработчик сброса формы
	const resetHandler = () => {
		reset(); // форма обнуляется
		setCheckboxFilter([]); // список чекнутых категорий обнуляется
		drugState.filterStatus && dispatch(clearFilters()); // если фильтр в работе - очищаем фильтры из state
	};

	// в потоке перебираем список лекарст по поиску и добавляем в список категорий для фильтрации не повторяющиеся категории из всех лекарств
	drugState.drugListSearch.forEach(drug => {
		drug.categories.forEach(category => {
			if (!categorySort.includes(category)) {
				categorySort.push(category);
			}
		});
	});

	return (
		<form className={styles.form}>
			<h4 className={styles.formTitle} onClick={() => setShowFilter(prev => !prev)}>
				Действие
				<FontAwesomeIcon icon={showFilter ? faCaretUp : faCaretDown} />
			</h4>
			<ul className={showFilter ? styles.formFiltersList : styles.formFiltersListDisplayNone}>

				{drugState.drugListSearch.length === 0 && drugState.fetchStatus === 'idle' && <div>не найдено</div>}
				{categorySort.sort().map(category => (
					<li key={category} className={styles.formFiltersItem}>
						<label className={styles.formFiltersLabel}>
							<input type="checkbox" id={category} {...register('action', { onChange: (e) => changeHandler(e) })} />
							{category}
						</label>
					</li>
				))}

			</ul>
		</form>
	);
};

export default FilterByAction;
