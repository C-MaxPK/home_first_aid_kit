import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { drugSortAsc, drugSortDesc, selectDrugState } from '../../store/drugSlice';
import { colorPrimary } from '../../constants/colors';
import { ISortProps } from './Sort.props';
import styles from './Sort.module.scss';

const Sort = ({ activeSort, setActiveSort }: ISortProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const drugState = useAppSelector(selectDrugState); // весь state

	// следит за состоянием флага фильтра
	useEffect(() => {
		setActiveSort(null);
	}, [drugState.filterStatus]);

	// сортировка по возрастанию
	const sortAscHandler = () => {
		if (activeSort !== 'asc') {
			setActiveSort('asc');
			if (drugState.filterStatus) dispatch(drugSortAsc('filter'));
			else dispatch(drugSortAsc('search'));
		}
	};

	// сортировка по убыванию
	const sortDescHandler = () => {
		if (activeSort !== 'desc') {
			setActiveSort('desc');
			if (drugState.filterStatus) dispatch(drugSortDesc('filter'));
			else dispatch(drugSortDesc('search'));
		}
	};

	return (
		<div className={styles.sort}>
			<FontAwesomeIcon
				icon={faArrowUpWideShort}
				onClick={sortAscHandler}
				style={activeSort !== 'asc' ? { cursor: 'pointer', color: 'grey' } : { color: colorPrimary }}
			/>
			<FontAwesomeIcon
				icon={faArrowDownWideShort}
				onClick={sortDescHandler}
				style={activeSort !== 'desc' ? { cursor: 'pointer', color: 'grey' } : { color: colorPrimary }}
			/>
		</div>
	);
};

export default Sort;
