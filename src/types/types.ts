export interface IRowTable {
	id: number;
	name: string;
	quantity: string;
	type: string;
	sellBy: string;
	overdue: string;
}

export type SellBy = 'withoutDay' | 'fullDate' | 'undefined';
