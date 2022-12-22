import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import drugReducer from './drugSlice';

export const store = configureStore({
  reducer: {
    drug: drugReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
