import { FormEvent, useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Checkbox, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addDrug, selectAddDrugStatus } from '../../store/drugSlice';
import { categoriesOfDrugs, packagesOfDrugs, typesOfDrugs } from '../../constants/drugs';
import ModalWindow from '../../HOK/ModalWindow/ModalWindow';
import { IFormDrugAdditionProps } from './FormDrugAddition.props';
import styles from './FormDrugAddition.module.scss';

const FormDrugAddition = ({ showFormDrugAddition, setShowFormDrugAddition }: IFormDrugAdditionProps): JSX.Element => {
	const currentDate = new Date().toISOString().slice(0, 10); // текущая дата ISO

	const [name, setName] = useState<string>(''); // название лекарства
	const [type, setType] = useState<string>(''); // тип лекарства
	const [amount, setAmount] = useState<number>(1); // количество
	const [pack, setPack] = useState<string>(''); // форма упаковки
	const [categories, setCategories] = useState<string[]>([]); // категории
	const [sellBy, setSellBy] = useState<string>(currentDate); // срок годности
	const [undefinedSellBy, setUndefinedSellBy] = useState<boolean>(false); // флаг неопределенности срока годности

	const dispatch = useAppDispatch();
	const addDrugStatus = useAppSelector(selectAddDrugStatus); // store - статус добавления лекарства в БД

	// следим за показом формы и сбрасываем данные input'ов
	useEffect(() => {
		name !== '' && setName('');
		type !== '' && setType('');
		amount !== 1 && setAmount(1);
		pack !== '' && setPack('');
		categories.length !== 0 && setCategories([]);
		sellBy !== '' && setSellBy(currentDate);
		undefinedSellBy && setUndefinedSellBy(false);
	}, [showFormDrugAddition]);

	// следим за состоянием добавления лекарства и если успешно - закрываем форму
	useEffect(() => {
		addDrugStatus === 'idle' && setShowFormDrugAddition(false);
	}, [addDrugStatus]);

	// обработчик отправки формы
	const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		dispatch(addDrug({ name, type, amount, pack, categories, sellBy: undefinedSellBy ? '-' : sellBy }));
	};

	// обработчик выбора категорий
	const handleChange = (event: SelectChangeEvent<typeof categories>) => {
		const { target: { value } } = event;
		setCategories(typeof value === 'string' ? value.split(',') : value);
	};

	return (
		<ModalWindow showModal={showFormDrugAddition} setShowModal={setShowFormDrugAddition} >
			<>
				<form onSubmit={(e) => submitHandler(e)}>
					<FormControl fullWidth margin='dense'>
						<TextField
							autoFocus
							required
							id="name"
							label="Название"
							variant="outlined"
							size="small"
							color='success'
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</FormControl>
					<FormControl fullWidth margin='dense'>
						<Autocomplete
							id="type"
							freeSolo
							options={typesOfDrugs}
							size="small"
							value={type}
							onChange={(_, value) => value && setType(value)}
							renderInput={(params) => <TextField {...params} required label="Тип" color='success' />}
						/>
					</FormControl>
					<FormControl fullWidth margin='dense'>
						<div className={styles.amountWrapper}>
							<TextField
								required
								id="amount"
								label="Количество"
								variant="outlined"
								type='number'
								size="small"
								color='success'
								value={amount}
								onChange={e => setAmount(+e.target.value)}
								inputProps={{ min: 1 }}
								sx={{ width: '50%' }}
							/>
							<Autocomplete
								id="package"
								freeSolo
								options={packagesOfDrugs}
								size="small"
								value={pack}
								onChange={(_, value) => value && setPack(value)}
								renderInput={(params) => <TextField {...params} required label="Упаковка" color='success' />}
								sx={{ width: '50%' }}
							/>
						</div>
					</FormControl>
					<FormControl fullWidth margin='dense' size="small">
						{/* <Autocomplete
								id="categories"
								freeSolo
								options={categoriesOfDrugs}
								size="small"
								value={categories[0]} // на доработку
								onChange={(_, value) => value && setCategories(prev => [...prev, prev[0] = value])} // на доработку
								renderInput={(params) => <TextField {...params} required label="Категории" color='success' />}
								sx={{ width: '100%' }}
							/> */}
						<InputLabel id="categories-label" color='success'>Категории</InputLabel>
						<Select
							required
							labelId="categories-label"
							id="categories"
							multiple
							color='success'
							value={categories}
							onChange={e => handleChange(e)}
							input={<OutlinedInput id="categories-chip" label="Категории" />}
							renderValue={(selected) => (
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}
						>
							{categoriesOfDrugs.map((category) => (
								<MenuItem key={category} value={category}>{category}</MenuItem>
							))}
						</Select>
					</FormControl>
					{!undefinedSellBy && <FormControl fullWidth margin='dense'>
						<TextField
							required
							id="sellBy"
							label="Срок годности"
							variant="outlined"
							size="small"
							type='date'
							color='success'
							value={sellBy}
							onChange={e => setSellBy(e.target.value)}
							inputProps={{ min: '1990-01-01' }}
						/>
					</FormControl>}
					<FormControlLabel control={
						<Checkbox checked={undefinedSellBy} onChange={e => setUndefinedSellBy(e.target.checked)} size='small' color='success' />
					} label='Невозможно определить срок годности' />
					<FormControl fullWidth margin='dense'>
						{addDrugStatus === 'loading' ?
							<Button variant="outlined" type="submit" disabled>
								Добавление...
							</Button>
							:
							<Button variant="outlined" type="submit" color='success'>
								Добавить
							</Button>
						}
					</FormControl>
				</form>
				{addDrugStatus === 'failed' && <p className={styles.error}>Ошибка добавления лекарства</p>}
			</>
		</ModalWindow>
	);
};

export default FormDrugAddition