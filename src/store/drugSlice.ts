import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { nanoid } from 'nanoid'
import { RootState } from './store';
import { db } from '../firebase';
import { ActiveSortType, IAddDrugProps, IDrug, IDrugState, IEditDrugProps, Status } from '../types/drugTypes';

const initialState: IDrugState = {
  drugList: [], // список лекарств
  search: '', // значение строки поиска
  filterList: {
    action: [], // список фильтров по действию
    type: [], // список фильтров по типу
  },
  sort: 'default',
  fetchStatus: 'idle', // статус загрузки лекарств из БД
  addDrugStatus: 'idle', // статус добавления лекарства в БД
};

// получение лекарств из БД firebase
export const fetchDrugList = createAsyncThunk(
  '@@drug/fetch',
  async (): Promise<IDrug[]> => {
    const querySnapshot = await getDocs(collection(db, "drugs"));
    const data: IDrug[] = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data() as IDrug);
    });
    return data;
  }
);

// добавление лекарства в БД firebase
export const addDrug = createAsyncThunk(
  '@@drug/addDrug',
  async ({ name, type, amount, pack, categories, sellBy }: IAddDrugProps, { dispatch, getState }) => {
    const id = nanoid();
    try {
      await setDoc(doc(db, "drugs", id), {
        id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        type: type.charAt(0).toUpperCase() + type.slice(1),
        amount,
        package: pack.charAt(0).toUpperCase() + pack.slice(1),
        categories,
        sellBy,
        createdAt: new Date().toString(),
        creator: (getState() as RootState).user.email,
      });
      dispatch(changeStatusAddDrug('idle'));
      dispatch(fetchDrugList());
    } catch (e) {
      dispatch(changeStatusAddDrug('failed'));
    }
  }
);

// изменение лекарства в БД firebase
export const editDrug = createAsyncThunk(
  '@@drug/editDrug',
  async ({ id, amount }: IEditDrugProps, { dispatch, getState }) => {
    try {
      const drugRef = doc(db, 'drugs', id);
      await setDoc(drugRef, {
        amount,
        editedAt: new Date().toString(),
        editor: (getState() as RootState).user.email,
      }, { merge: true });
      dispatch(fetchDrugList());
    } catch (e) {
      console.log('Ошибка редактирования', e)
    }
  }
);

// удаление лекарства из БД firebase
export const deleteDrug = createAsyncThunk(
  '@@drug/deleteDrug',
  async (id: string, { dispatch }) => {
    await deleteDoc(doc(db, "drugs", id));
    dispatch(fetchDrugList());
  }
);

export const drugSlice = createSlice({
  name: '@@drug',
  initialState,
  reducers: {
    // очищение списков фильтров
    clearFilterList: (state) => {
      state.filterList = initialState.filterList;
    },
    // добавление значения строки поиска
    addSearchValue: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    // добавление списка фильтров по действию
    addFilterListByAction: (state, action: PayloadAction<string[]>) => {
      state.filterList.action = action.payload;
    },
    // добавление списка фильтров по типу
    addFilterListByType: (state, action: PayloadAction<string[]>) => {
      state.filterList.type = action.payload;
    },
    // выбор типа сортировки
    changeSort: (state, action: PayloadAction<ActiveSortType>) => {
      state.sort = action.payload;
    },
    // изменение статуса добавления лекарства
    changeStatusAddDrug: (state, action: PayloadAction<Status>) => {
      state.addDrugStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrugList.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchDrugList.fulfilled, (state, action: PayloadAction<IDrug[]>) => {
        state.fetchStatus = 'idle';
        state.drugList = action.payload;
      })
      .addCase(fetchDrugList.rejected, (state) => {
        state.fetchStatus = 'failed';
      })
      .addCase(addDrug.pending, (state) => {
        state.addDrugStatus = 'loading';
      });
  },
});

export const { clearFilterList, addSearchValue, addFilterListByAction, addFilterListByType, changeSort, changeStatusAddDrug } = drugSlice.actions;

export const selectDrugState = (state: RootState) => state.drug;
export const selectDrugList = (state: RootState) => state.drug.drugList;
export const selectSearchValue = (state: RootState) => state.drug.search;
export const selectFilterList = (state: RootState) => state.drug.filterList;
export const selectSortType = (state: RootState) => state.drug.sort;
export const selectFetchStatus = (state: RootState) => state.drug.fetchStatus;
export const selectAddDrugStatus = (state: RootState) => state.drug.addDrugStatus;
export const selectVisibleDrugs = (state: RootState, onlySearch?: boolean) => {
  // список фильтрованных лекарств по поиску
  const visibleDrugsOnSearch = state.drug.drugList.filter(drug => drug.name?.toLowerCase().includes(state.drug.search.toLowerCase()));
  // если используется select только для отображения лекарств по поиску (для списка фильтров)
  if (onlySearch) return visibleDrugsOnSearch;

  const temporary: IDrug[] = []; // времянка1 для лекарств с одним видом фильтров

  // перебираем список чекнутых категорий по действию
  state.drug.filterList.action.forEach(actionName => {
    // добавляем во времянку отфильтрованные лекарства из списка по поиску, которые: отсутствуют во времянке и содержат чекнутую категорию
    temporary.push(...visibleDrugsOnSearch.filter(drug => !temporary.includes(drug) && drug.categories.includes(actionName)));
  });

  // перебираем список чекнутых категорий по типу
  state.drug.filterList.type.forEach(typeName => {
    // добавляем во времянку отфильтрованные лекарства из списка по поиску, которые: отсутствуют во времянке и содержат чекнутую категорию
    temporary.push(...visibleDrugsOnSearch.filter(drug => !temporary.includes(drug) && drug.type === typeName));
  });

  // если есть оба списка фильтров
  if (state.drug.filterList.action.length > 0 && state.drug.filterList.type.length > 0) {
    // времянка2
    const temporary2 = temporary.filter(drug => {
      // ищем пересечения в списке фильтрации по действию и в списке лекарства из времянки1
      const intersection = state.drug.filterList.action.filter(actionNameFilter => drug.categories.includes(actionNameFilter));
      // оставляем лекарства, в которых есть совпадения (действие, тип)
      return intersection.length > 0 && state.drug.filterList.type.includes(drug.type);
    });
    return temporary2;
  }
  else if (state.drug.filterList.action.length > 0 || state.drug.filterList.type.length > 0) return temporary;
  else return visibleDrugsOnSearch;
};

export default drugSlice.reducer;
