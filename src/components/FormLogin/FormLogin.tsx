import { FormEvent, useEffect, useState } from 'react';
import { Button, FormControl, TextField } from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import useAuth from '../../hooks/useAuth';
import { clearError, login } from '../../store/userSlice';
import ModalWindow from '../../HOK/ModalWindow/ModalWindow';
import { IFormLoginProps } from './FormLogin.props';
import styles from './FormLogin.module.scss';

const FormLogin = ({ showFormLogin, setShowFormLogin }: IFormLoginProps): JSX.Element => {
	const [email, setEmail] = useState<string>(''); // поле почты
	const [pass, setPass] = useState<string>(''); //  поле пароля
	const dispatch = useAppDispatch();
	const { isAuth, error, status } = useAuth(); // hook проверки авторизации

	// следим за показом формы и сбрасываем данные input'ов
	useEffect(() => {
		email !== '' && setEmail('');
		pass !== '' && setPass('');
	}, [showFormLogin]);

	// следим за полями ввода и при существовании ошибки - очищаем
	useEffect(() => {
		error && dispatch(clearError());
	}, [email, pass]);

	// следим за состоянием авторизации и если успешно - закрываем форму
	useEffect(() => {
		isAuth && setShowFormLogin(false);
	}, [isAuth]);

	// обработчик отправки формы
	const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		dispatch(login({ email, pass }));
	};

	return (
		<ModalWindow showModal={showFormLogin} setShowModal={setShowFormLogin}>
			<>
				<form onSubmit={(e) => submitHandler(e)}>
					<FormControl fullWidth margin='dense'>
						<TextField
							autoFocus
							required
							id="email"
							label='Почта'
							variant="outlined"
							size="small"
							type="email"
							color='success'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</FormControl>
					<FormControl fullWidth margin='dense'>
						<TextField
							required
							id="password"
							label='Пароль'
							variant="outlined"
							size="small"
							type="password"
							color='success'
							value={pass}
							onChange={e => setPass(e.target.value)}
						/>
					</FormControl>

					<FormControl fullWidth margin='dense'>
						{status === 'loading' ?
							<Button variant="outlined" type="submit" disabled>
								Вход...
							</Button>
							:
							<Button variant="outlined" type="submit" color='success'>
								Войти
							</Button>
						}
					</FormControl>
				</form>
				{status === 'failed' && <p className={styles.error}>Ошибка: {error}</p>}
			</>
		</ModalWindow>
	);
};

export default FormLogin;
