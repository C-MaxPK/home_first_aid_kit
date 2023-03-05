import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Search from '../../components/Search/Search';
// import Sort from './components/Sort/Sort';
import Filters from '../../components/Filters/Filters';
import Drugs from '../../components/Drugs/Drugs';
import Logo from './logo.png';
import { ActiveSortType } from '../../types/types';
import styles from './Home.module.scss';

const Home = (): JSX.Element => {
	const [activeSort, setActiveSort] = useState<ActiveSortType>(null); // активная сортировка

	return (
		<div className={styles.app}>

			<header className={styles.header}>
				<img src={Logo} alt="Логотип" />
				<Search activeSort={activeSort} setActiveSort={setActiveSort} />

				{/* <Sort activeSort={activeSort} setActiveSort={setActiveSort} /> */}

				<Link to={`inventory`} className={styles.link}>
					<Button variant="text" color="success" >Инвентаризация</Button>
				</Link>
			</header>

			<main className={styles.main}>
				<Filters />
				<Drugs />
			</main>

		</div>
	);
}

export default Home;
