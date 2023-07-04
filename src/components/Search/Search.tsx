import { useEffect, useRef, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addSearchValue, clearFilterList, selectFilterList } from '../../store/drugSlice';
// import { ISearchProps } from './Search.props';

const Search = (/* { activeSort, setActiveSort }: ISearchProps */): JSX.Element => {
	const [inputValue, setInputValue] = useState<string>(''); // строка поиска input
	const inputRef = useRef<HTMLInputElement>(); // ссылка на input
	const dispatch = useAppDispatch();
	const filterList = useAppSelector(selectFilterList); // store - списки пунктов для фильтрации

	// следим за input'ом
	useEffect(() => {
		(filterList.action.length > 0 || filterList.type.length > 0) && dispatch(clearFilterList()); // если списки фильтров не пустые - очищаем
		// if (activeSort !== null) setActiveSort(null); // если сортировка была - сбрасываем
		dispatch(addSearchValue(inputValue)); // добавление значения строки поиска в store
	}, [dispatch, inputValue]);

	// обработчик очистки input'а
	const clearHandler = (): void => {
		setInputValue(''); // очищаем поле
		inputRef.current?.focus(); // ставим фокус обратно в поле
	};

	return (
		<TextField
			id="outlined-basic"
			inputRef={inputRef}
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
						{inputValue.length > 0 && <FontAwesomeIcon icon={faXmark} onClick={clearHandler} style={{ cursor: 'pointer' }} />}
					</InputAdornment>
				),
			}}
		/>
	);
};

export default Search;
