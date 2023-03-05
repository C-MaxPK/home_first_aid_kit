import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Home from './page/Home/Home';
import Inventory from './page/Inventory/Inventory';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <div style={{ textAlign: 'center' }}>Похоже такой страницы не существует, горцуй на <Link to={`/`}>главную</Link> :-)</div>,
  },
  {
    path: "/inventory",
    element: <Inventory />,
  },
]);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);
