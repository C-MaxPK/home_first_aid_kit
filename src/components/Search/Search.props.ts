import { Dispatch } from 'react';
import { ActiveSortType } from '../../types/types';

export interface ISearchProps {
	activeSort: ActiveSortType;
	setActiveSort: Dispatch<React.SetStateAction<ActiveSortType>>;
}
