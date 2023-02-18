import { Dispatch } from 'react';
import { SwitchType } from '../../types/types';

export interface IFilterByActionProps {
	filterSwitch: SwitchType;
	setFilterSwitch: Dispatch<React.SetStateAction<SwitchType>>;
}
