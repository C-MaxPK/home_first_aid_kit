import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridToolbarQuickFilter, ruRU } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDrugList, selectDrugList } from '../../store/drugSlice';
import { declination } from '../../helpers/declination';
import { getOverdueDrug } from '../../helpers/overdue';
import { IRowTable } from '../../types/types';
import styles from './InventoryTable.module.scss';

const CustomToolbar = (): JSX.Element => {
	return (
		<Box sx={{ p: 1, pb: 0 }} >
			<GridToolbarQuickFilter />
		</Box>
	);
};

const InventoryTable = (): JSX.Element => {
	const [drugListForTable, setDrugListForTable] = useState<IRowTable[]>([]); // список лекарств, форматированных для таблицы
	const dispatch = useAppDispatch();
	const drugList = useAppSelector(selectDrugList); // список лекарств
	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Название', width: 350, headerClassName: styles.header },
		{ field: 'quantity', headerName: 'Количество', width: 200, headerClassName: styles.header },
		{ field: 'type', headerName: 'Вид', width: 200, headerClassName: styles.header },
		{ field: 'sellBy', headerName: 'Срок годности', width: 150, headerClassName: styles.header },
		{ field: 'overdue', headerName: 'Просрок', width: 150, headerClassName: styles.header }
	];

	// разово - получает список лекарств из БД
	useEffect(() => {
		drugList.length === 0 && dispatch(fetchDrugList()); // если не был загружен до этого
	}, [dispatch]);

	// следит за списком лекарств
	useEffect(() => {
		// форматируем список лекарств для таблицы
		const formatData = drugList.map((drug, idx) => {
			return {
				id: idx,
				name: drug.name,
				quantity: `${drug.amount} ${declination(drug.amount, drug.package)}`,
				type: drug.type.toLowerCase(),
				sellBy: drug.sellBy,
				overdue: getOverdueDrug(drug.sellBy) ? 'просрочен' : ''
			};
		});
		setDrugListForTable(formatData); // записываем в state компонента
	}, [drugList]);

	return (
		<Box sx={{ height: 630, width: '100%' }}>
			<DataGrid
				rows={drugListForTable}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 100,
						},
					},
				}}
				pageSizeOptions={[10, 20, 50, 100]}
				checkboxSelection
				rowHeight={25}
				disableColumnMenu
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
				components={{
					Toolbar: CustomToolbar
				}}
			/>
		</Box>
	);
};

export default InventoryTable;
