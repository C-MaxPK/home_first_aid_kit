export interface IDrug {
	id: number; // или string (uid)
	name: string;
	type: string;
	amount: number;
	package: string;
	categories: string[];
	sellBy: string;
}

export interface IDrugState {
	drugList: IDrug[];
	drugListSearch: IDrug[];
	drugListFilter: IDrug[];
	fetchStatus: 'idle' | 'loading' | 'failed';
	filterStatus: boolean;
}

export type ActiveSortType = 'asc' | 'desc' | null;
export type FilterSwitchType = 'action' | 'type' | null;

export interface IRowTable {
	id: number;
	name: string;
	quantity: string;
	type: string;
	sellBy: string;
	overdue: string;
}
