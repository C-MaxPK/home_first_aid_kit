import { useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearFilters, drugSearch, selectFilterStatus } from '../../store/drugSlice';
import { ISearchProps } from './Search.props';

const Search = ({ activeSort, setActiveSort }: ISearchProps): JSX.Element => {
	const [inputValue, setInputValue] = useState<string>(''); // строка поиска input
	const dispatch = useAppDispatch();
	const filterStatus = useAppSelector(selectFilterStatus); // фильтрация в работе?

	// следит за input'ом
	useEffect(() => {
		filterStatus && dispatch(clearFilters()); // если фильтрация была в работе - то очищаем фильтры
		// if (activeSort !== null) setActiveSort(null); // если сортировка была - сбрасываем
		dispatch(drugSearch(inputValue)); // поиск по введенным данным  в input
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
			fullWidth
			InputProps={{
				endAdornment: (
					<InputAdornment position="end" >
						{inputValue.length > 0 && <FontAwesomeIcon icon={faXmark} onClick={() => setInputValue('')} style={{ cursor: 'pointer ' }} />}
					</InputAdornment>
				),
			}}
		/>
	);
};

export default Search;
