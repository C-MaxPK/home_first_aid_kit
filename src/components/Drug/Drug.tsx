import { declination } from '../../helpers/helpers';
import { IDrugProps } from './Drug.props';
import styles from './Drug.module.scss';

const Drug = ({ drug }: IDrugProps): JSX.Element => {
	// вычисляем просроченный товар
	const getOverdueDrug = (sellBy: string): boolean => {
		const currentDate = Date.now(); // текущая дата UTC
		if (sellBy === '-') return false; // если нет даты
		// если дата без числа
		if (sellBy.length === 7) {
			const getMonth = +(sellBy[0] + sellBy[1]); // получаем месяц
			const getYear = +(sellBy[3] + sellBy[4] + sellBy[5] + sellBy[6]); // получаем год
			const lastDayDate = new Date(getYear, getMonth, 0).getDate(); // получаем последнее число месяца
			const dateUSFormat = `${getMonth}/${lastDayDate}/${getYear}`; // дата в US формате
			if (currentDate > Date.parse(`${dateUSFormat} 23:59:59`)) return true;
			return false;
		} else {
			// если дата полная
			const getDay = sellBy[0] + sellBy[1]; // получаем день
			const getMonth = sellBy[3] + sellBy[4]; // получаем месяц
			const getYear = sellBy[6] + sellBy[7] + sellBy[8] + sellBy[9]; // получаем год
			const dateUSFormat = `${getMonth}/${getDay}/${getYear}`; // дата в US формате
			if (currentDate > Date.parse(`${dateUSFormat} 23:59:59`)) return true;
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
