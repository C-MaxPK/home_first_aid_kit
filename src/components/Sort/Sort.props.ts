import { Dispatch } from 'react';
import { ActiveSortType } from '../../types/types';

export interface ISortProps {
	activeSort: ActiveSortType;
	setActiveSort: Dispatch<React.SetStateAction<ActiveSortType>>;
}
