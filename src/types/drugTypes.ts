export interface IDrug {
	id: number; // или string (uid)
	name: string;
	type: string;
	amount: number;
	package: string;
	categories: string[];
	sellBy: string;
}

export type ActiveSortType = 'asc' | 'desc' | 'default';

export interface IDrugState {
	drugList: IDrug[];
	search: string;
	filterList: {
		action: string[];
		type: string[];
	};
	sort: ActiveSortType;
	fetchStatus: 'idle' | 'loading' | 'failed';
}