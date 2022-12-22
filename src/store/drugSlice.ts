import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface IDrug {
  id: number; // или string (uid)
  name: string;
  type: string; // или ENUM
  amount: number;
  package: string;  // или ENUM
  categories: string[];  // или массив Типов
  sellBy: string; // или Date
}

export interface IDrugState {
  drugList: IDrug[];
  drugListSearch: IDrug[];
  drugListFilter: IDrug[];
  fetchStatus: 'idle' | 'loading' | 'failed';
  filterStatus: boolean;
}

const initialState: IDrugState = {
  drugList: [], // список лекарств, полученный из БД
  drugListSearch: [], // список лекарств по поиску (фильтрует из drugList)
  drugListFilter: [], // список отфильтрованных лекарств от списка в поиске (фильтрует из drugListSearch)
  fetchStatus: 'idle', // статус загрузки лекарств из БД
  filterStatus: false // фильтрация в работе?
};

// получение лекарств из БД
export const fetchDrugList = createAsyncThunk(
  '@@fetchDrugList',
  async (): Promise<IDrug[]> => {
    const response = await fetch('./db/drugs.json');
    const data: IDrug[] = await response.json();
    return data;
  }
);

export const drugSlice = createSlice({
  name: '@@drugs',
  initialState,
  reducers: {
    // очищаем фильтры
    clearFilters: (state) => {
      state.filterStatus = initialState.filterStatus; // статус фильтрации - обнуляем
      state.drugListFilter = initialState.drugListFilter; // список фильтрованных лекарств - обнуляем
    },
    // поиск лекарств
    drugSearch: (state, action: PayloadAction<string>) => {
      state.filterStatus = false; // статус фильтрации - обнуляем
      const regexp = new RegExp(action.payload, 'i'); // регулярка с введенными данными из input
      state.drugListSearch = state.drugList.filter(drug => regexp.test(drug.name)); // оставляем в списке по поиску - что подошло
    },
    // фильтрация по поиску
    drugFiltration: (state, action: PayloadAction<string[]>) => {
      state.filterStatus = true; // статус фильтрации - включаем
      let arr: IDrug[] = []; // времянка
      // перебираем список чекнутых категорий
      action.payload.forEach(actionName => {
        // добавляем во времянку отфильтрованные лекарства из списка по поиску, которые: отсутствуют во времянке и содержат чекнутую категорию
        arr.push(...state.drugListSearch.filter(drug => !arr.includes(drug) && drug.categories.includes(actionName)));
      });
      state.drugListFilter = [...arr]; // заменяем список фильтрованных лекарств времянкой 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrugList.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchDrugList.fulfilled, (state, action: PayloadAction<IDrug[]>) => {
        state.fetchStatus = 'idle';
        state.drugList = action.payload; // добавляем в главный список лекарств
        state.drugListSearch = action.payload; // дублируем в список по поиску
      })
      .addCase(fetchDrugList.rejected, (state) => {
        state.fetchStatus = 'failed';
      });
  },
});

export const { clearFilters, drugFiltration, drugSearch } = drugSlice.actions;

export const selectDrugState = (state: RootState) => state.drug;
export const selectDrugListSearch = (state: RootState) => state.drug.drugListSearch;
export const selectDrugListFilter = (state: RootState) => state.drug.drugListFilter;
export const selectFilterStatus = (state: RootState) => state.drug.filterStatus;

export default drugSlice.reducer;
