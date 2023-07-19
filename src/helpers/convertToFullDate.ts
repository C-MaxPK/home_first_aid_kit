export const convertToFullDate = (date: string): string => {
	// date: 'YYYY-MM'
	const getYear = date.slice(0, 4); // получаем год
	const getMonth = date.slice(-2); // получаем месяц
	const lastDayDate = new Date(+getYear, +getMonth, 0).getDate(); // получаем последнее число месяца
	const dateISOFormat = `${getYear}-${getMonth}-${lastDayDate}`; // дата в ISO формате
	return dateISOFormat;
};
