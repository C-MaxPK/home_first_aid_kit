import { IDrug } from '../../store/drugSlice';
import styles from './Drug.module.scss';

interface IDrugProps {
	drug: IDrug
}

const Drug = ({ drug }: IDrugProps): JSX.Element => {

	return (
		<div className={styles.drug}>
			<div className={styles.drugImg}>
				<img src="https://via.placeholder.com/250" alt={drug.name} />
			</div>
			<div className={styles.drugDesc}>
				<h3 className={styles.drugName}>{drug.name}</h3>

				<div className={styles.drugDescType}>
					{drug.type}
				</div>
				<div >
					<span className={styles.drugDescTitle}>Остаток:</span> <span className={styles.drugDescValue}>{drug.amount} {drug.package}</span>
				</div>

				<div>
					<span className={styles.drugDescTitle}>Годен до:</span> {drug.sellBy}
				</div>

				<div className={styles.drugDescCategories}>
					{drug.categories.map(category => (
						<span className={styles.drugDescCategory} key={category}>{category} </span>
					))}
				</div>

			</div>
		</div>
	);
};

export default Drug;
