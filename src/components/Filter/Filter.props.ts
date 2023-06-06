export interface IFilterProps {
	title: string;
	filterListLength: number; // при увеличении фильтров сделать number[]
	addFilterListFunc: (payload: string[]) => {
		payload: string[];
		type: "@@drugs/addFilterListByAction" | "@@drugs/addFilterListByType";
	}
}
