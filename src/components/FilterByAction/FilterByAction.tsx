import { ChangeEvent, Dispatch, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearFilters, drugFiltrationByAction, selectDrugState } from '../../store/drugSlice';
import styles from './FilterByAction.module.scss';
import { SwitchType } from '../Filters/Filters';

export interface IFilterByActionProps {
	filterSwitch: SwitchType;
	setFilterSwitch: Dispatch<React.SetStateAction<SwitchType>>
}

const FilterByAction = ({ filterSwitch, setFilterSwitch }: IFilterByActionProps): JSX.Element => {
	const [checkboxFilter, setCheckboxFilter] = useState<string[]>([]); // список чекнутых категорий
	const dispatch = useAppDispatch();
	const drugState = useAppSelector(selectDrugState); // весь state
	const { register, reset } = useForm(); // регистрация и сброс от useForm
	const categorySort: string[] = []; // список категорий для фильтрации;

	// следит за списком чекнутых категорий
	useEffect(() => {
		// если этот список пустой и статус фильтрации - в работе, то очищаем фильтры
		if (checkboxFilter.length === 0 && drugState.filterStatus) {
			dispatch(clearFilters());
			// иначе если список имеет хотя бы одну запись - фильтруем список
		} else if (checkboxFilter.length > 0) {
			dispatch(drugFiltrationByAction(checkboxFilter));
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
		reset(); // форма обнуляется
		setCheckboxFilter([]); // список чекнутых категорий обнуляется
		dispatch(clearFilters()); // очищаем фильтры из state
	};

	// обработчик переключателя фильтров
	const switchHandler = () => {
		// если флаг - текущий
		if (filterSwitch === 'action') {
			setFilterSwitch(null); // сбрасываем флаг
			resetHandler(); // сбрасываем форму
		} else {
			setFilterSwitch('action'); // меняем на текущий флаг
			resetHandler(); // сбрасываем форму
		}
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
			<h4 className={styles.formTitle} onClick={switchHandler}>
				Действие
				<FontAwesomeIcon icon={filterSwitch === 'action' ? faCaretUp : faCaretDown} />
			</h4>
			{filterSwitch === 'action' && <>
				<ul className={styles.formFiltersList}>

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
				{drugState.filterStatus && checkboxFilter.length > 0 && <Button variant="outlined" color="success" size="small" onClick={resetHandler} sx={{ marginTop: '10px' }}>Очистить</Button>}
			</>}
		</form>
	);
};

export default FilterByAction;
