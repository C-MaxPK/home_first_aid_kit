import { declination } from '../../helpers/declination';
import { getOverdueDrug } from '../../helpers/overdue';
import { IDrugProps } from './Drug.props';
import styles from './Drug.module.scss';

const Drug = ({ drug }: IDrugProps): JSX.Element => {

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
						<div className={styles.drugDescCategory} key={category}>{category} </div>
					))}
				</div>
			</div>
			{getOverdueDrug(drug.sellBy) && <div className={styles.drugSignOverdue}>Просрочено</div>}
		</div>
	);
};

export default Drug;
