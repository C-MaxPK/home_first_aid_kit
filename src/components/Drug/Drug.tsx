import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleInfo, faPencil, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../store/hooks';
import useAuth from '../../hooks/useAuth';
import { deleteDrug, editDrug } from '../../store/drugSlice';
import { declination } from '../../helpers/declination';
import { getOverdueDrug } from '../../helpers/overdue';
import { colorPrimary, colorRed, colorSecondary } from '../../constants/colors';
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

	// обработчик закрытия редактора остатка
	const closeAmountEditorHandler = (): void => {
		setShowAmountEditor(false); // убираем редактор
		setInputAmount(drug.amount); // возвращаем значение
	};

	// обработчик нажатия клавишы
	const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (e.code === 'Escape') closeAmountEditorHandler();
	};

	// обработчик удаления лекарства
	const deleteHandler = (): void => {
		dispatch(deleteDrug(drug.id)); // удаляем лекарство
		setShowAlertDialog(false); // закрываем окно
	};

	return (
		<>
			<div className={drug.sellBy !== '-' ? styles.drug : [styles.drug, styles.drugNoSellBy].join(' ')}>

				{isAuth &&
					<div className={styles.drugInfo}>
						<FontAwesomeIcon icon={faCircleInfo} color={colorSecondary} />
						<div className={styles.drugInfoBlock}>
							<p>
								<span className={styles.drugInfoTitle}>Создано: </span>
								{new Date(drug.createdAt).toLocaleDateString()} {new Date(drug.createdAt).toLocaleTimeString()} ({drug.creator})
							</p>
							{drug.editedAt &&
								<p>
									<span className={styles.drugInfoTitle}>Изменено: </span>
									{new Date(drug.editedAt).toLocaleDateString()} {new Date(drug.editedAt).toLocaleTimeString()} ({drug.editor})
								</p>
							}
						</div>
					</div>
				}

				<div className={styles.drugImg}>
					<img src="https://via.placeholder.com/250" alt={drug.name} />
				</div>

				<div className={styles.drugDesc}>
					<h3 className={styles.drugDescName}>{drug.name}</h3>

					<div className={styles.drugDescType}>
						{drug.type}
					</div>

					<div className={styles.drugDescAmount}>
						<div className={styles.drugDescAmountLeftBlock}>
							<p className={styles.drugDescTitle}>Остаток:</p>
							<div className={styles.drugDescAmountTitle}>
								{
									showAmountEditor ?
										<form id='amount' onSubmit={changeAmountHandler}>
											<input
												className={styles.drugDescAmountInput}
												type='number'
												min={1}
												max={100}
												step={1}
												value={inputAmount}
												onChange={e => setInputAmount(+e.target.value)}
												autoFocus
												onKeyDown={e => keyDownHandler(e)}
											/>
										</form>
										:
										drug.amount
								}
								<p className={styles.drugDescAmountPackage}>{declination(drug.amount, drug.package)}</p>
							</div>
						</div>

						{isAuth && <>
							{showAmountEditor ?
								<div className={styles.drugControl}>
									<button className={styles.drugControlBtn} type='submit' form='amount'>
										<FontAwesomeIcon icon={faCheck} size="xl" title='Сохранить' style={{ cursor: 'pointer', color: colorPrimary }} />
									</button>
									<button className={styles.drugControlBtn}>
										<FontAwesomeIcon icon={faXmark} size="xl" title='Отменить' style={{ cursor: 'pointer', color: colorRed }} onClick={closeAmountEditorHandler} />
									</button>
								</div>
								:
								<div className={styles.drugControl}>
									<FontAwesomeIcon icon={faPencil} size='sm' title='Изменить остаток' style={{ cursor: 'pointer', color: colorPrimary }} onClick={() => setShowAmountEditor(true)} />
									<FontAwesomeIcon icon={faTrashCan} size='sm' title='Удалить лекарство' style={{ cursor: 'pointer', color: colorRed }} onClick={() => setShowAlertDialog(true)} />
								</div>
							}
						</>}
					</div>

					<div className={drug.sellBy === '-' ? styles.drugDescNoSellBy : ''}>
						<span className={styles.drugDescTitle}>Годен до:</span> {drug.sellBy}
					</div>

					<div className={drug.categories.length > 0 ? styles.drugDescCategories : ''}>
						{drug.categories.map(category => (
							<div className={styles.drugDescCategory} key={category}>{category} </div>
						))}
					</div>
				</div >

				{getOverdueDrug(drug.sellBy) && <div className={styles.drugSignOverdue}>Просрочено</div>}

			</div >

			<AlertDialog showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} submitHandler={deleteHandler} name={drug.name} />
		</>
	);
};

export default Drug;
