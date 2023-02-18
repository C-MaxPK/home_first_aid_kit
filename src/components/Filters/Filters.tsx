import { useState } from 'react';
import { SwitchType } from '../../types/types';
import FilterByAction from '../FilterByAction/FilterByAction';
import FilterByType from '../FilterByType/FilterByType';
import styles from './Filters.module.scss';

const Filters = (): JSX.Element => {
	const [filterSwitch, setFilterSwitch] = useState<SwitchType>(null); // переключатель флага фильтров

	return (
		<div className={styles.filters}>
			<FilterByAction filterSwitch={filterSwitch} setFilterSwitch={setFilterSwitch} />
			<FilterByType filterSwitch={filterSwitch} setFilterSwitch={setFilterSwitch} />
		</div>
	);
};

export default Filters;
