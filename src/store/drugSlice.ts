import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { IDrug, IDrugState } from '../types/types';

const initialState: IDrugState = {
  drugList: [], // список лекарств, полученный из БД
  drugListSearch: [], // список лекарств по поиску (фильтрует из drugList)
  drugListFilter: [], // список отфильтрованных лекарств от списка в поиске (фильтрует из drugListSearch)
  filterList: {
    action: [], // список фильтров по действию
    type: [] // список фильтров по типу
  },
  fetchStatus: 'idle', // статус загрузки лекарств из БД
  filterStatus: false // статус активности фильтрации
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
      state.filterList = initialState.filterList; // список фильтров - обнуляем
    },
    // поиск лекарств
    drugSearch: (state, action: PayloadAction<string>) => {
      const regexp = new RegExp(action.payload, 'i'); // регулярка с введенными данными из input
      state.drugListSearch = state.drugList.filter(drug => regexp.test(drug.name)); // оставляем в списке по поиску - что подошло
    },
    // добавление списка фильтров по действию
    addFilterListByAction: (state, action: PayloadAction<string[]>) => {
      state.filterStatus = true; // статус фильтрации - включаем
      state.filterList.action = action.payload; // добавляем список фильтров
    },
    // добавление списка фильтров по типу
    addFilterListByType: (state, action: PayloadAction<string[]>) => {
      state.filterStatus = true; // статус фильтрации - включаем
      state.filterList.type = action.payload; // добавляем список фильтров
    },
    // функция полной фильтрации по всем видам (действию, типу)
    generalFiltrationDrugs: (state) => {
      const temporary: IDrug[] = []; // времянка1

      // перебираем список чекнутых категорий по действию
      state.filterList.action.forEach(actionName => {
        // добавляем во времянку отфильтрованные лекарства из списка по поиску, которые: отсутствуют во времянке и содержат чекнутую категорию
        temporary.push(...state.drugListSearch.filter(drug => !temporary.includes(drug) && drug.categories.includes(actionName)));
      });

      // перебираем список чекнутых категорий по типу
      state.filterList.type.forEach(typeName => {
        // добавляем во времянку отфильтрованные лекарства из списка по поиску, которые: отсутствуют во времянке и содержат чекнутую категорию
        temporary.push(...state.drugListSearch.filter(drug => !temporary.includes(drug) && drug.type === typeName));
      });

      // если есть оба списка с фильтрами
      if (state.filterList.action.length > 0 && state.filterList.type.length > 0) {
        // времянка2
        const temporary2 = temporary.filter(drug => {
          // ищем пересечения в списке фильтрации по действию и в списке лекарства
          const intersection = state.filterList.action.filter(actionNameFilter => drug.categories.includes(actionNameFilter));
          // оставляем лекарства, в которых есть совпадения (действие, тип)
          return intersection.length > 0 && state.filterList.type.includes(drug.type);
        });
        state.drugListFilter = [...temporary2]; // заменяем список фильтрованных лекарств времянкой2
      } else {
        state.drugListFilter = [...temporary]; // иначе заменяем список фильтрованных лекарств времянкой1
      }
    },
    // сортировка по возрастанию
    drugSortAsc: (state, action: PayloadAction<'filter' | 'search'>) => {
      (action.payload === 'search' ? state.drugListSearch : state.drugListFilter).sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
    },
    // сортировка по убыванию
    drugSortDesc: (state, action: PayloadAction<'filter' | 'search'>) => {
      (action.payload === 'search' ? state.drugListSearch : state.drugListFilter).sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        }
        if (a.name > b.name) {
          return -1;
        }
        return 0;
      });
    }
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

export const { clearFilters, addFilterListByAction, addFilterListByType, drugSearch, drugSortAsc, drugSortDesc, generalFiltrationDrugs } = drugSlice.actions;

export const selectDrugState = (state: RootState) => state.drug;
export const selectDrugList = (state: RootState) => state.drug.drugList;
export const selectDrugListSearch = (state: RootState) => state.drug.drugListSearch;
export const selectDrugListFilter = (state: RootState) => state.drug.drugListFilter;
export const selectFilterList = (state: RootState) => state.drug.filterList;
export const selectFilterStatus = (state: RootState) => state.drug.filterStatus;

export default drugSlice.reducer;
