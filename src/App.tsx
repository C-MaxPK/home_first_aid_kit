import { useEffect } from 'react';
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useAppDispatch } from './store/hooks';
import { fetchDrugList } from './store/drugSlice';
import { onAuthState } from './store/userSlice';
import Home from './page/Home/Home';
import Inventory from './page/Inventory/Inventory';
import NotFound from './page/NotFound/NotFound';

const App = () => {
	const dispatch = useAppDispatch();
	const [cookies] = useCookies(['isAuth']); // hook для работы с cookie

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
			errorElement: <NotFound />,
		},
		{
			path: "/inventory",
			element: <Inventory />,
			loader: () => {
				// если есть запись в cookie об авторизации - разрешаем роут, иначе на главную
				if (cookies.isAuth) return null;
				else return redirect('/');
			}
		},
	]);

	// разово
	useEffect(() => {
		dispatch(fetchDrugList()); // получаем список лекарств из БД
		dispatch(onAuthState()); // запрашиваем статус авторизации
	}, [dispatch]);

	return <RouterProvider router={router} />;
};

export default App;
