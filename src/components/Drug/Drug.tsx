import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPencil, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../store/hooks';
import useAuth from '../../hooks/useAuth';
import { deleteDrug, editDrug } from '../../store/drugSlice';
import { declination } from '../../helpers/declination';
import { getOverdueDrug } from '../../helpers/overdue';
import { colorPrimary, colorRed } from '../../constants/colors';
import AlertDialog from '../AlertDialog/AlertDialog';
import { IDrugProps } from './Drug.props';
import styles from './Drug.module.scss';

const Drug = ({ drug }: IDrugProps): JSX.Element => {
	const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false); // показ диалогового окна об удалении лекарства
	const [showAmountEditor, setShowAmountEditor] = useState<boolean>(false); // показ редактора остатка
	const [inputAmount, setInputAmount] = useState<number>(drug.amount); // остаток лекарства

	const dispatch = useAppDispatch();
	const { isAuth } = useAuth(); // hook проверки авторизации

	// обработчик изменения остатка лекарства
	const changeAmountHandler = (): void => {
		setShowAmountEditor(false); // убираем редактор 
		if (drug.amount === inputAmount) return; // если количество не поменялось - выходим без изменений
		dispatch(editDrug({ id: drug.id, amount: inputAmount })); // изменяем остаток
	};

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
							<span className={styles.drugDescTitle}>Остаток:</span>
							<span> {showAmountEditor ?
								<input type='number' min={1} value={inputAmount} onChange={e => setInputAmount(+e.target.value > 1 ? Math.round(+e.target.value) : 1)} autoFocus />
								:
								drug.amount} {declination(drug.amount, drug.package)}</span>
						</div>
						{isAuth && <>
							{showAmountEditor ?
								<div className={styles.drugControl}>
									<FontAwesomeIcon icon={faCheck} size="lg" title='Сохранить' style={{ cursor: 'pointer', color: colorPrimary }} onClick={changeAmountHandler} />
									<FontAwesomeIcon icon={faXmark} size="lg" title='Отменить' style={{ cursor: 'pointer', color: colorRed }} onClick={() => setShowAmountEditor(false)} />
								</div>
								:
								<div className={styles.drugControl}>
									<FontAwesomeIcon icon={faPencil} size='sm' title='Изменить остаток' style={{ cursor: 'pointer', color: colorPrimary }} onClick={() => setShowAmountEditor(true)} />
									<FontAwesomeIcon icon={faTrashCan} size='sm' title='Удалить лекарство' style={{ cursor: 'pointer', color: colorRed }} onClick={() => setShowAlertDialog(true)} />
								</div>
							}
						</>}
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
