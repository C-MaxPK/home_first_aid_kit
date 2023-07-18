import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../store/hooks';
import useAuth from '../../hooks/useAuth';
import { deleteDrug } from '../../store/drugSlice';
import { declination } from '../../helpers/declination';
import { getOverdueDrug } from '../../helpers/overdue';
import { colorPrimary } from '../../constants/colors';
import AlertDialog from '../AlertDialog/AlertDialog';
import { IDrugProps } from './Drug.props';
import styles from './Drug.module.scss';

const Drug = ({ drug }: IDrugProps): JSX.Element => {
	const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false); // показ диалогового окна об удалении лекарства
	const { isAuth } = useAuth(); // hook проверки авторизации
	const dispatch = useAppDispatch();

	// обработчик удаления лекарства
	const deleteHandler = (): void => {
		dispatch(deleteDrug(drug.id)); // удаляем лекарство
		setShowAlertDialog(false); // закрываем окно
	};

	return (
		<>
			<div className={drug.sellBy !== '-' ? styles.drug : [styles.drug, styles.drugNoSellBy].join(' ')}>
				<div className={styles.drugImg}>
					<img src="https://via.placeholder.com/250" alt={drug.name} />
				</div>
				<div className={styles.drugDesc}>
					<h3 className={styles.drugName}>{drug.name}</h3>

					<div className={styles.drugDescType}>
						{drug.type}
					</div>
					<div className={styles.drugDescAmount}>
						<div>
							<span className={styles.drugDescTitle}>Остаток:</span> <span>{drug.amount} {declination(drug.amount, drug.package)}</span>
						</div>
						{isAuth && <div className={styles.drugControl}>
							<FontAwesomeIcon icon={faPencil} size='sm' title='Изменить количество' style={{ cursor: 'pointer', color: colorPrimary }} />
							<FontAwesomeIcon icon={faTrashCan} size='sm' title='Удалить лекарство' style={{ cursor: 'pointer', color: '#d72d2d' }} onClick={() => setShowAlertDialog(true)} />
						</div>}
					</div>

					<div className={drug.sellBy === '-' ? styles.drugDescTitleNoSellBy : ''}>
						<span className={styles.drugDescTitle}>Годен до:</span> {drug.sellBy}
					</div>

					<div className={drug.categories.length > 0 ? styles.drugDescCategories : ''}>
						{drug.categories.map(category => (
							<div className={styles.drugDescCategory} key={category}>{category} </div>
						))}
					</div>
				</div>
				{getOverdueDrug(drug.sellBy) && <div className={styles.drugSignOverdue}>Просрочено</div>}
			</div>

			<AlertDialog showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} submitHandler={deleteHandler} name={drug.name} />
		</>
	);
};

export default Drug;
