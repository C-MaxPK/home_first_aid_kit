import { useAppSelector } from '../../store/hooks';
import { selectFetchStatus, selectVisibleDrugs } from '../../store/drugSlice';
import { declination } from '../../helpers/declination';
import Drug from '../Drug/Drug';
import styles from './Drugs.module.scss';

const Drugs = (): JSX.Element => {
	const fetchStatus = useAppSelector(selectFetchStatus); // статус загрузки лекарств
	const visibleDrugs = useAppSelector(selectVisibleDrugs); // store - фильтрованный список лекарств

	return (
		<div className={styles.drugsWrapper}>
			{fetchStatus === 'failed' && <p>Ошибка получения данных</p>}
			{fetchStatus === 'loading' && <p>Загрузка ...</p>}

			{fetchStatus === 'idle' && visibleDrugs.length === 0 &&
				<p>Не найдено</p>
			}

			{fetchStatus === 'idle' && visibleDrugs.length > 0 &&
				<p className={styles.drugsCount}>
					Найдено {visibleDrugs.length} {declination(visibleDrugs.length, 'лекарство')}
				</p>
			}

			<div className={styles.drugs}>
				{visibleDrugs.map(drug => (
					<Drug key={drug.id} drug={drug} />
				))}
			</div>
		</div>
	);
};

export default Drugs;
