import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeSort, selectSortType } from '../../store/drugSlice';
import { colorPrimary, colorSecondary } from '../../constants/colors';
import { ActiveSortType } from '../../types/types';
import styles from './Sort.module.scss';

const Sort = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const sortType = useAppSelector(selectSortType); // store - тип сортировки

	// обработчик сортировки
	const sortHandler = (type: ActiveSortType): void => {
		if (sortType !== type) dispatch(changeSort(type));
		else dispatch(changeSort('default'));
	};

	return (
		<div className={styles.sort}>
			<FontAwesomeIcon
				icon={faArrowUpWideShort}
				onClick={() => sortHandler('asc')}
				style={{ cursor: 'pointer', color: sortType !== 'asc' ? colorSecondary : colorPrimary }}
				title='Сортировка по возрастанию'
			/>
			<FontAwesomeIcon
				icon={faArrowDownWideShort}
				onClick={() => sortHandler('desc')}
				style={{ cursor: 'pointer', color: sortType !== 'desc' ? colorSecondary : colorPrimary }}
				title='Сортировка по убыванию'
			/>
		</div>
	);
};

export default Sort;
