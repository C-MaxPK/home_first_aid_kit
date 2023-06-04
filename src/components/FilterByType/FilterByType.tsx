import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFilterListByType, clearFilters, generalFiltrationDrugs, selectDrugState } from '../../store/drugSlice';
import styles from './FilterByType.module.scss';

const FilterByType = (/* {  }: IFilterByTypeProps */): JSX.Element => {
	const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]); // список чекнутых типов
	const [showFilter, setShowFilter] = useState<boolean>(true); // показ развернутого фильтра
	const dispatch = useAppDispatch();
	const drugState = useAppSelector(selectDrugState); // весь state
	const { register, reset } = useForm(); // регистрация и сброс от useForm
	const typeSort: string[] = []; // список типов для фильтрации;

	// следит за списком чекнутых типов
	useEffect(() => {
		// если этот список и список других фильтров пустой, статус фильтрации - в работе, то очищаем фильтры
		if (checkboxFilter.length === 0 && drugState.filterList.action.length === 0 && drugState.filterStatus) dispatch(clearFilters());
		// иначе если список имеет хотя бы одну запись или другие списки не пустые
		else if (checkboxFilter.length > 0 || drugState.filterList.action.length > 0) {
			dispatch(addFilterListByType(checkboxFilter)); // добавляем в store список для фильтрации
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
		else setCheckboxFilter(prevState => prevState.filter(typeName => typeName !== e.target.id));
	};

	// обработчик сброса формы
	const resetHandler = () => {
		reset(); // форма обнуляется
		setCheckboxFilter([]); // список чекнутых категорий обнуляется
		drugState.filterStatus && dispatch(clearFilters()); // если фильтр в работе - очищаем фильтры из state
	};

	// в потоке перебираем список лекарст по поиску и добавляем в список типов для фильтрации не повторяющиеся типов из всех лекарств
	drugState.drugListSearch.forEach(drug => {
		if (!typeSort.includes(drug.type)) {
			typeSort.push(drug.type);
		}
	});

	return (
		<form className={styles.form}>
			<h4 className={styles.formTitle} onClick={() => setShowFilter(prev => !prev)}>
				Тип
				<FontAwesomeIcon icon={showFilter ? faCaretUp : faCaretDown} />
			</h4>
			<ul className={showFilter ? styles.formFiltersList : styles.formFiltersListDisplayNone}>

				{drugState.drugListSearch.length === 0 && drugState.fetchStatus === 'idle' && <div>не найдено</div>}
				{typeSort.sort().map(type => (
					<li key={type} className={styles.formFiltersItem}>
						<label className={styles.formFiltersLabel}>
							<input type="checkbox" id={type} {...register('type', { onChange: (e) => changeHandler(e) })} />
							{type.toLowerCase()}
						</label>
					</li>
				))}

			</ul>
		</form>
	);
};

export default FilterByType;
