import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { FirebaseError } from 'firebase/app';
import { RootState } from './store';
import { ILoginProps, ISetUserProps, IUserState } from '../types/userTypes';

const initialState: IUserState = {
	email: null,
	id: null,
	error: null,
	status: 'idle',
};

// login
export const login = createAsyncThunk(
	'@@user/login',
	async ({ email, pass }: ILoginProps, { rejectWithValue }) => {
		try {
			const auth = getAuth();
			const response: UserCredential = await signInWithEmailAndPassword(auth, email, pass);
			return response;
		} catch (error) {
			if (error) {
				// возвращаем данные ошибки, пришедшие с бэка
				return rejectWithValue(error);
			}
		}
	}
);

// logout
export const logout = createAsyncThunk(
	'@@user/logout',
	async () => {
		const auth = getAuth();
		signOut(auth);
	}
);

// isAuth
export const onAuthState = createAsyncThunk(
	'@@user/onAuthState',
	async (_, { dispatch, getState }) => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				dispatch(setUser({ email: user.email, id: user.uid }));
			} else {
				if ((getState() as RootState).user.id) {
					dispatch(removeUser());
				}
			}
		});
	}
);

export const userSlice = createSlice({
	name: '@@user',
	initialState,
	reducers: {
		// устанавливаем пользователя
		setUser: (state, action: PayloadAction<ISetUserProps>) => {
			state.id = action.payload.id;
			state.email = action.payload.email;
		},
		// удаляем пользователя
		removeUser: (state) => {
			state.id = initialState.id;
			state.email = initialState.email;
		},
		// сбрасываем ошибку авторизации
		clearError: (state) => {
			state.error = initialState.error;
			state.status = initialState.status;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(login.fulfilled, (state, action: PayloadAction<UserCredential | undefined>) => {
				state.status = 'idle';
				state.error = null;
				if (action.payload) {
					state.email = action.payload.user.email;
					state.id = action.payload.user.uid;
				}
			})
			.addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
				state.status = 'failed';
				if (action.payload instanceof FirebaseError) {
					state.error = action.payload.code;
				}
			})
			.addCase(logout.pending, () => {
				console.log('logout loading');
			})
			.addCase(logout.fulfilled, () => {
				console.log('logout fulfilled');
			})
			.addCase(logout.rejected, () => {
				console.log('logout rejected');
			})
			.addCase(onAuthState.pending, () => {
				console.log('onAuthState loading');
			})
			.addCase(onAuthState.fulfilled, () => {
				console.log('onAuthState fulfilled');
			})
			.addCase(onAuthState.rejected, () => {
				console.log('onAuthState rejected');
			});
	},
});

export const { setUser, removeUser, clearError } = userSlice.actions;

export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;
