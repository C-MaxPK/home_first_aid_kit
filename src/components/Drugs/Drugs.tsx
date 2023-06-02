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
		drugState.drugList.length === 0 && dispatch(fetchDrugList()); // если не был загружен до этого
	}, [dispatch]);

	return (
		<div className={styles.drugsWrapper}>
			{drugState.fetchStatus === 'failed' && <div>ошибка получении данных</div>}

			{drugState.fetchStatus === 'idle' && (drugState.drugListSearch.length === 0 || drugState.filterStatus && drugState.drugListFilter.length === 0) &&
				<div>не найдено</div>
			}

			<div className={styles.drugs}>
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
		</div>
	);
};

export default Drugs;
