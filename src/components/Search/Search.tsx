import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearFilters, drugSearch, selectFilterStatus } from '../../store/drugSlice';

const Search = (): JSX.Element => {
	const [inputValue, setInputValue] = useState<string>(''); // строка поиска input
	const dispatch = useAppDispatch();
	const filterStatus = useAppSelector(selectFilterStatus); // фильтрация в работе?

	// следит за input'ом
	useEffect(() => {
		// если фильтрация была в работе - то очищаем фильтры
		if (filterStatus) {
			dispatch(clearFilters());
		}
		// inputValue !== '' && dispatch(drugSearch(inputValue));
		// поиск по введенным данным  в input
		dispatch(drugSearch(inputValue));
	}, [dispatch, inputValue]);

	return (
		<TextField
			id="outlined-basic"
			label="Поиск по лекарству..."
			variant="outlined"
			size="small"
			color="success"
			value={inputValue}
			onChange={e => setInputValue(e.target.value)}
			autoFocus
			// fullWidth
			style={{ width: '300px' }}
		/>
	);
};

export default Search;
