import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Search from '../../components/Search/Search';
import Sort from '../../components/Sort/Sort';
import Avatar from '../../components/Avatar/Avatar';
import Filters from '../../components/Filters/Filters';
import Drugs from '../../components/Drugs/Drugs';
import ScrollUpButton from '../../components/ScrollUpButton/ScrollUpButton';
import FormLogin from '../../components/FormLogin/FormLogin';
import Logo from './logo.png';
import styles from './Home.module.scss';

const Home = (): JSX.Element => {
	const [showFormLogin, setShowFormLogin] = useState<boolean>(false); // показ формы авторизации
	const [_, setCookie, removeCookie] = useCookies(['isAuth']); // hook для работы с cookie
	const { isAuth } = useAuth(); // hook проверки авторизации

	// следим за статусом авторизации
	useEffect(() => {
		// если авторизован - записываем (обновляем) в cookie на неделю, иначе удаляем запись
		if (isAuth) setCookie(`isAuth`, true, { path: '/', maxAge: 604800 });
		else removeCookie('isAuth');
	}, [isAuth]);

	return (
		<div className={styles.app}>

			<header className={styles.header}>
				<img src={Logo} alt="Логотип" />
				<Search />
				<Sort />
				{isAuth ?
					<Avatar />
					:
					<Button variant="text" color="success" onClick={() => setShowFormLogin(prev => !prev)}>Войти</Button>
				}
			</header>

			<main className={styles.main}>
				<Filters />
				<Drugs />
			</main>

			<ScrollUpButton />
			<FormLogin showFormLogin={showFormLogin} setShowFormLogin={setShowFormLogin} />

		</div>
	);
};

export default Home;
