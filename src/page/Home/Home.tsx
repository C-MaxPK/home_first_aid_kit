import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Search from '../../components/Search/Search';
import Sort from '../../components/Sort/Sort';
import Filters from '../../components/Filters/Filters';
import Drugs from '../../components/Drugs/Drugs';
import ScrollUpButton from '../../components/ScrollUpButton/ScrollUpButton';
import Logo from './logo.png';
import styles from './Home.module.scss';

const Home = (): JSX.Element => {

	return (
		<div className={styles.app}>

			<header className={styles.header}>
				<img src={Logo} alt="Логотип" />
				<Search />
				<Sort />
				<Link to={`inventory`} className={styles.link}>
					<Button variant="text" color="success" >Инвентаризация</Button>
				</Link>
			</header>

			<main className={styles.main}>
				<Filters />
				<Drugs />
			</main>

			<ScrollUpButton />

		</div>
	);
};

export default Home;
