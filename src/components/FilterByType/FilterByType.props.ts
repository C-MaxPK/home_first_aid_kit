import { Dispatch } from 'react';
import { SwitchType } from '../../types/types';

export interface IFilterByTypeProps {
	filterSwitch: SwitchType;
	setFilterSwitch: Dispatch<React.SetStateAction<SwitchType>>;
}
