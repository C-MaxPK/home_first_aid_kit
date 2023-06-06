import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFilterListByAction, addFilterListByType, clearFilters, selectFilterList, selectFilterStatus } from '../../store/drugSlice';
import Filter from '../Filter/Filter';
import styles from './Filters.module.scss';

const Filters = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const filterList = useAppSelector(selectFilterList); // store - списки пунктов для фильтрации
	const filterStatus = useAppSelector(selectFilterStatus); // store - статус фильтрации

	return (
		<div className={styles.filters}>
			<Filter
				title='Действие'
				filterListLength={filterList.type.length}
				addFilterListFunc={addFilterListByAction}
			/>
			<Filter
				title='Тип'
				filterListLength={filterList.action.length}
				addFilterListFunc={addFilterListByType}
			/>
			{filterStatus &&
				<Button
					variant="text"
					color="success"
					size='small'
					onClick={() => dispatch(clearFilters())}
					sx={{ margin: '5px 0' }}
				>
					Очистить фильтры
				</Button>
			}
		</div>
	);
};

export default Filters;
