import FilterByAction from '../FilterByAction/FilterByAction';
import FilterByType from '../FilterByType/FilterByType';
import styles from './Filters.module.scss';

const Filters = (): JSX.Element => {

	return (
		<div className={styles.filters}>
			<FilterByAction />
			<FilterByType />
		</div>
	);
};

export default Filters;
