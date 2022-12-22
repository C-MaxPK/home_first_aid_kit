import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDrugList, selectDrugState } from '../../store/drugSlice';
import Drug from '../Drug/Drug';
import styles from './Drugs.module.scss';

const Drugs = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const drugState = useAppSelector(selectDrugState); // весь state

	// разово - получает список лекарств из БД
	useEffect(() => {
		dispatch(fetchDrugList());
	}, [dispatch]);

	return (
		<div className={styles.drugs}>
			{drugState.fetchStatus === 'failed' && <div>ошибка получении данных</div>}
			{drugState.drugListSearch.length === 0 && drugState.fetchStatus === 'idle' && <div>не найдено</div>}
			{drugState.filterStatus ?
				drugState.drugListFilter.map(drug => (
					<Drug key={drug.id} drug={drug} />
				))
				:
				drugState.drugListSearch.map(drug => (
					<Drug key={drug.id} drug={drug} />
				))
			}
		</div>
	);
};

export default Drugs;
