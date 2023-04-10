const getSetOfWordsForDeclension = (title: string): [string, string, string] => {
	switch (title) {
		case 'флакон':
			return ['флакон', 'флакона', 'флаконов'];
		case 'ампула':
			return ['ампула', 'ампулы', 'ампул'];
		case 'штука':
			return ['штука', 'штуки', 'штук'];
		case 'пластина':
			return ['пластина', 'пластины', 'пластин'];
		case 'тюбик':
			return ['тюбик', 'тюбика', 'тюбиков'];
		case 'баллон':
			return ['баллон', 'баллона', 'баллонов'];
		case 'банка':
			return ['банка', 'банки', 'банок'];
		case 'пакетик':
			return ['пакетик', 'пакетика', 'пакетиков'];
		case 'фильтр-пакет':
			return ['фильтр-пакет', 'фильтр-пакета', 'фильтр-пакетов'];
		default:
			return ['штука', 'штуки', 'штук'];
	}
};

// функция для склонения слов
export const declination = (number: number, title: string): string => {
	const setOfWords = getSetOfWordsForDeclension(title.toLowerCase());
	const cases = [2, 0, 1, 1, 1, 2];
	return setOfWords[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5 ? number % 10 : 5)]];
};
