import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { colorSecondary } from '../../constants/colors';
import Search from '../../components/Search/Search';
// import Sort from './components/Sort/Sort';
import Filters from '../../components/Filters/Filters';
import Drugs from '../../components/Drugs/Drugs';
import Logo from './logo.png';
// import { ActiveSortType } from '../../types/types';
import styles from './Home.module.scss';

const Home = (): JSX.Element => {
	// const [activeSort, setActiveSort] = useState<ActiveSortType>(null); // активная сортировка
	const [scroll, setScroll] = useState<number>(0); // высота прокрутки в пикселях

	// подписываемся на событие прокрутки
	useEffect(() => {
		window.addEventListener("scroll", setScrollFunc);
		// отписываемся от события прокрутки
		return () => window.removeEventListener("scroll", setScrollFunc);
	}, []);

	// функция установки в state высоты прокрутки
	const setScrollFunc = (): void => {
		setScroll(window.scrollY);
	};

	// плавный скролл до верха страницы
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	};

	return (
		<div className={styles.app}>

			<header className={styles.header}>
				<img src={Logo} alt="Логотип" />
				<Search /* activeSort={activeSort} setActiveSort={setActiveSort} */ />

				{/* <Sort activeSort={activeSort} setActiveSort={setActiveSort} /> */}

				<Link to={`inventory`} className={styles.link}>
					<Button variant="text" color="success" >Инвентаризация</Button>
				</Link>
			</header>

			<main className={styles.main}>
				<Filters />
				<Drugs />
			</main>

			{scroll > 300 && <div className={styles.arrowUp} onClick={scrollToTop}>
				<FontAwesomeIcon icon={faChevronUp} size='xl' color={colorSecondary} />
			</div>}

		</div>
	);
};

export default Home;
