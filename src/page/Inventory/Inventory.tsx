import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import InventoryTable from '../../components/InventoryTable/InventoryTable';
import styles from './Inventory.module.scss';

const Inventory = (): JSX.Element => {

	return (
		<div className={styles.inventory}>
			<Link to={`/`} className={styles.link}>
				<Button variant="text" color="success">На главную</Button>
			</Link>
			<InventoryTable />
		</div>
	);
};

export default Inventory;
