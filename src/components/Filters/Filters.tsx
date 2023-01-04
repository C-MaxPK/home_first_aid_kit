import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearFilters, drugFiltration, selectDrugListSearch, selectDrugState, selectFilterStatus } from '../../store/drugSlice';
import styles from './Filters.module.scss';

const Filters = (): JSX.Element => {
	const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]); // список чекнутых категорий
	const dispatch = useAppDispatch();
	const drugState = useAppSelector(selectDrugState); // весь state
	const { register, reset } = useForm(); // регистрация и сброс от useForm
	const categorySort: string[] = []; // список категорий для фильтрации;

	// следит за списком чекнутых категорий
	useEffect(() => {
		// если этот список пустой и статус фильтрации - в работе то очищаем фильтры
		if (checkboxFilter.length === 0 && drugState.filterStatus) {
			dispatch(clearFilters());
			// иначе если список имеет хотя бы одну запись - фильтруем список
		} else if (checkboxFilter.length > 0) {
			dispatch(drugFiltration(checkboxFilter));
		}
	}, [checkboxFilter, dispatch]);

	// следит за статусом работы фильтрации
	useEffect(() => {
		// если фильтрация НЕ в работе - обнуляем форму
		!drugState.filterStatus && checkboxFilter.length > 1 && resetHandler();
	}, [drugState.filterStatus]);

	// обработчик изминения чекбокса
	const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
		// если инпут чекнулся - добавляем в список чекнутых категорий
		if (e.target.checked) {
			setCheckboxFilter(prevState => [...prevState, e.target.id]);
			// иначе убираем его из этого списка
		} else {
			setCheckboxFilter(prevState => prevState.filter(actionName => actionName !== e.target.id));
		}
	};

	// обработчик сброса формы
	const resetHandler = () => {
		// форма обнуляется
		reset();
		// список чекнутых категорий обнуляется
		setCheckboxFilter([]);
		// очищаем фильтры из state
		dispatch(clearFilters());
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
			<h4 className={styles.formTitle}>Действие:</h4>
			<ul className={styles.formFiltersList}>

				{drugState.drugListSearch.length === 0 && drugState.fetchStatus === 'idle' && <div>не найдено</div>}
				{categorySort.map(category => (
					<li key={category} className={styles.formFiltersItem}>
						<label className={styles.formFiltersLabel}>
							<input type="checkbox" id={category} {...register('example', { onChange: (e) => changeHandler(e) })} />
							{category}
						</label>
					</li>
				))}

			</ul>
			{drugState.filterStatus && <Button variant="outlined" color="success" size="small" onClick={resetHandler} sx={{ marginTop: '10px' }}>Очистить</Button>}
		</form>
	);
};

export default Filters;
