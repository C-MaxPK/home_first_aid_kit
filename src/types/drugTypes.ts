export interface IAddDrugProps {
	name: string;
	type: string;
	amount: number;
	pack: string;
	categories: string[];
	sellBy: string;
}

export interface IEditDrugProps {
	id: string;
	amount: number;
}

export interface IDrug {
	id: string;
	name: string;
	type: string;
	amount: number;
	package: string;
	categories: string[];
	sellBy: string;
	createdAt: string;
	creator: string;
	editedAt?: string;
	editor?: string;
}

export type ActiveSortType = 'asc' | 'desc' | 'default';
export type Status = 'idle' | 'loading' | 'failed';

export interface IDrugState {
	drugList: IDrug[];
	search: string;
	filterList: {
		action: string[];
		type: string[];
	};
	sort: ActiveSortType;
	fetchStatus: Status;
	addDrugStatus: Status;
	deleteDrugStatus: Status;
}