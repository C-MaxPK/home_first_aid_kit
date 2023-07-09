export interface IFilterProps {
	title: string;
	thisFilterListLength: number;
	otherFilterListLength: number; // при увеличении фильтров сделать number[]
	addFilterListFunc: (payload: string[]) => {
		payload: string[];
		type: "@@drug/addFilterListByAction" | "@@drug/addFilterListByType";
	}
}
