import { useAppSelector } from '../../store/hooks';
import { selectFetchStatus, selectSortType, selectVisibleDrugs } from '../../store/drugSlice';
import { declination } from '../../helpers/declination';
import { IDrug } from '../../types/types';
import Drug from '../Drug/Drug';
import styles from './Drugs.module.scss';

const Drugs = (): JSX.Element => {
	const sortType = useAppSelector(selectSortType); // store - тип сортировки
	const fetchStatus = useAppSelector(selectFetchStatus); // store - статус загрузки лекарств
	const visibleDrugs = useAppSelector(selectVisibleDrugs); // store - фильтрованный список лекарств

	// сортировка
	const sorting = (a: IDrug, b: IDrug): 1 | 0 | -1 => {
		if (sortType === 'default') {
			if (a.id > b.id) return 1;
			else if (a.id < b.id) return -1;
		} else {
			if (a.name > b.name) return sortType === 'asc' ? 1 : -1;
			else if (a.name < b.name) return sortType === 'asc' ? -1 : 1;
		}
		return 0;
	};

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
				{visibleDrugs
					.sort(sorting)
					.map(drug => (
						<Drug key={drug.id} drug={drug} />
					))
				}
			</div>
		</div>
	);
};

export default Drugs;
