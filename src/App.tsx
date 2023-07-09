import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAppDispatch } from './store/hooks';
import { fetchDrugList } from './store/drugSlice';
import { onAuthState } from './store/userSlice';
import Home from './page/Home/Home';
import Inventory from './page/Inventory/Inventory';
import NotFound from './page/NotFound/NotFound';

const App = () => {
	const dispatch = useAppDispatch();
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
			errorElement: <NotFound />,
		},
		{
			path: "/inventory",
			element: <Inventory />,
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
