import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFilterListByAction, addFilterListByType, clearFilterList, selectFilterList } from '../../store/drugSlice';
import Filter from '../Filter/Filter';
import styles from './Filters.module.scss';

const Filters = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const filterList = useAppSelector(selectFilterList); // store - списки пунктов для фильтрации

	return (
		<div className={styles.filters}>
			<Filter
				title='Действие'
				thisFilterListLength={filterList.action.length}
				otherFilterListLength={filterList.type.length}
				addFilterListFunc={addFilterListByAction}
			/>
			<Filter
				title='Тип'
				thisFilterListLength={filterList.type.length}
				otherFilterListLength={filterList.action.length}
				addFilterListFunc={addFilterListByType}
			/>
			{(filterList.action.length > 0 || filterList.type.length > 0) &&
				<Button
					variant="text"
					color="success"
					size='small'
					onClick={() => dispatch(clearFilterList())}
					sx={{ margin: '5px 0' }}
				>
					Очистить фильтры
				</Button>
			}
		</div>
	);
};

export default Filters;
