import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = (): JSX.Element => {
	return (
		<p className={styles.notFoundText}>
			Похоже такой страницы не существует, горцуй на <Link to={`/`}>главную</Link> :-)
		</p>
	);
};

export default NotFound;
