import { useState } from 'react';
import FilterByAction from '../FilterByAction/FilterByAction';
import FilterByType from '../FilterByType/FilterByType';
import styles from './Filters.module.scss';

export type SwitchType = null | 'action' | 'type';

const Filters = (): JSX.Element => {
	const [filterSwitch, setFilterSwitch] = useState<SwitchType>(null); // переключатель флагов фильтров

	return (
		<div className={styles.filters}>
			<FilterByAction filterSwitch={filterSwitch} setFilterSwitch={setFilterSwitch} />
			<FilterByType filterSwitch={filterSwitch} setFilterSwitch={setFilterSwitch} />
		</div>
	);
};

export default Filters;
