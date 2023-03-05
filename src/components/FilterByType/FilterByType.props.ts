import { Dispatch } from 'react';
import { FilterSwitchType } from '../../types/types';

export interface IFilterByTypeProps {
	filterSwitch: FilterSwitchType;
	setFilterSwitch: Dispatch<React.SetStateAction<FilterSwitchType>>;
}
