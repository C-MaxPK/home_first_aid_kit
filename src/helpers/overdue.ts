// вычисляем просроченный товар
export const getOverdueDrug = (sellBy: string): boolean => {
	if (sellBy === '-') return false; // если нет даты
	else if (new Date() > new Date(sellBy + 'T23:59:59')) return true; // если просрок
	else return false;
};
