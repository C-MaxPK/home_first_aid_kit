import { Button } from '@mui/material';
import FilterByAction from '../FilterByAction/FilterByAction';
import FilterByType from '../FilterByType/FilterByType';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearFilters, selectFilterStatus } from '../../store/drugSlice';
import styles from './Filters.module.scss';

const Filters = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const filterStatus = useAppSelector(selectFilterStatus); // store - статус фильтрации

	return (
		<div className={styles.filters}>
			<FilterByAction />
			<FilterByType />
			{filterStatus &&
				<Button variant="text" color="success" size='small' onClick={() => dispatch(clearFilters())}>
					Очистить фильтры
				</Button>
			}
		</div>
	);
};

export default Filters;
