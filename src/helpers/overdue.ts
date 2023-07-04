// вычисляем просроченный товар
export const getOverdueDrug = (sellBy: string): boolean => {
	const currentDate = Date.now(); // текущая дата UTC
	if (sellBy === '-') return false; // если нет даты
	// если дата без числа
	if (sellBy.length === 7) {
		const getMonth = +(sellBy[0] + sellBy[1]); // получаем месяц
		const getYear = +(sellBy[3] + sellBy[4] + sellBy[5] + sellBy[6]); // получаем год
		const lastDayDate = new Date(getYear, getMonth, 0).getDate(); // получаем последнее число месяца
		const dateUSFormat = `${getMonth}/${lastDayDate}/${getYear}`; // дата в US формате
		if (currentDate > Date.parse(`${dateUSFormat} 23:59:59`)) return true;
		else return false;
	} else {
		// если дата полная
		const getDay = sellBy[0] + sellBy[1]; // получаем день
		const getMonth = sellBy[3] + sellBy[4]; // получаем месяц
		const getYear = sellBy[6] + sellBy[7] + sellBy[8] + sellBy[9]; // получаем год
		const dateUSFormat = `${getMonth}/${getDay}/${getYear}`; // дата в US формате
		if (currentDate > Date.parse(`${dateUSFormat} 23:59:59`)) return true;
		else return false;
	}
};
