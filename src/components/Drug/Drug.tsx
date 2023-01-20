import { IDrug } from '../../store/drugSlice';
import { declination } from '../../helpers/helpers';
import styles from './Drug.module.scss';

interface IDrugProps {
	drug: IDrug
}

const Drug = ({ drug }: IDrugProps): JSX.Element => {
	// вычисляем просроченный товар
	const getOverdueDrug = (sellBy: string): boolean => {
		const currentDate = Date.now();
		if (sellBy === '-') return false;
		// попробовать replace()
		if (sellBy.length === 7) {
			const getMonth = +(sellBy[0] + sellBy[1]);
			const getYear = +(sellBy[3] + sellBy[4] + sellBy[5] + sellBy[6]);
			const lastDayDate = new Date(getYear, getMonth, 0).getDate();
			const dateUSFormat = `${getMonth}.${lastDayDate}.${getYear}`;
			if (currentDate > Date.parse(dateUSFormat)) return true;
			return false;
		} else {
			const getDay = sellBy[0] + sellBy[1];
			const getMonth = sellBy[3] + sellBy[4];
			const getYear = sellBy[6] + sellBy[7] + sellBy[8] + sellBy[9];
			const dateUSFormat = `${getMonth}.${getDay}.${getYear}`;
			if (currentDate > Date.parse(dateUSFormat)) return true;
			else return false;
		}
	};

	return (
		<div className={drug.sellBy !== '-' ? styles.drug : [styles.drug, styles.drugNoSellBy].join(' ')}>
			<div className={styles.drugImg}>
				<img src="https://via.placeholder.com/250" alt={drug.name} />
			</div>
			<div className={styles.drugDesc}>
				<h3 className={styles.drugName}>{drug.name}</h3>

				<div className={styles.drugDescType}>
					{drug.type}
				</div>
				<div >
					<span className={styles.drugDescTitle}>Остаток:</span> <span>{drug.amount} {declination(drug.amount, drug.package)}</span>
				</div>

				<div className={drug.sellBy === '-' ? styles.drugDescTitleNoSellBy : ''}>
					<span className={styles.drugDescTitle}>Годен до:</span> {drug.sellBy}
				</div>

				<div className={drug.categories.length > 0 ? styles.drugDescCategories : ''}>
					{drug.categories.map(category => (
						<span className={styles.drugDescCategory} key={category}>{category} </span>
					))}
				</div>
			</div>
			{getOverdueDrug(drug.sellBy) && <div className={styles.drugSignOverdue}>Просрочено</div>}
		</div>
	);
};

export default Drug;
