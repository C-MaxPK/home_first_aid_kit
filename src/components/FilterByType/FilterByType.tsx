import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearFilters, drugFiltrationByType, selectDrugState } from '../../store/drugSlice';
import { IFilterByTypeProps } from './FilterByType.props';
import styles from './FilterByType.module.scss';

const FilterByType = ({ filterSwitch, setFilterSwitch }: IFilterByTypeProps): JSX.Element => {
	const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]); // список чекнутых типов
	const dispatch = useAppDispatch();
	const drugState = useAppSelector(selectDrugState); // весь state
	const { register, reset } = useForm(); // регистрация и сброс от useForm
	const typeSort: string[] = []; // список типов для фильтрации;

	// следит за списком чекнутых типов
	useEffect(() => {
		// если этот список пустой и статус фильтрации - в работе, то очищаем фильтры
		if (checkboxFilter.length === 0 && drugState.filterStatus) dispatch(clearFilters());
		// иначе если список имеет хотя бы одну запись - фильтруем список
		else if (checkboxFilter.length > 0) dispatch(drugFiltrationByType(checkboxFilter));
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

	// обработчик переключателя фильтров
	const switchHandler = () => {
		// если флаг - текущий
		if (filterSwitch === 'type') {
			setFilterSwitch(null); // сбрасываем флаг
			resetHandler(); // сбрасываем форму
		} else {
			setFilterSwitch('type'); // меняем на текущий флаг
			resetHandler(); // сбрасываем форму
		}
	};

	// в потоке перебираем список лекарст по поиску и добавляем в список типов для фильтрации не повторяющиеся типов из всех лекарств
	drugState.drugListSearch.forEach(drug => {
		if (!typeSort.includes(drug.type)) {
			typeSort.push(drug.type);
		}
	});

	return (
		<form className={styles.form}>
			<h4 className={styles.formTitle} onClick={switchHandler}>
				Тип
				<FontAwesomeIcon icon={filterSwitch === 'type' ? faCaretUp : faCaretDown} />
			</h4>
			{filterSwitch === 'type' && <>
				<ul className={styles.formFiltersList}>

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
				{drugState.filterStatus && checkboxFilter.length > 0 && <Button variant="outlined" color="success" size="small" onClick={resetHandler} sx={{ marginTop: '10px' }}>Очистить</Button>}
			</>}
		</form>
	);
};

export default FilterByType;
