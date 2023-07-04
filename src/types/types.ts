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
	search: string;
	filterList: {
		action: string[];
		type: string[];
	};
	fetchStatus: 'idle' | 'loading' | 'failed';
}

export type ActiveSortType = 'asc' | 'desc' | null;

export interface IRowTable {
	id: number;
	name: string;
	quantity: string;
	type: string;
	sellBy: string;
	overdue: string;
}
