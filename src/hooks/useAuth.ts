import { useAppSelector } from '../store/hooks'
import { selectUserState } from '../store/userSlice';

// hook проверки авторизации
const useAuth = () => {
	const { email, id, error, status } = useAppSelector(selectUserState);

	return {
		isAuth: !!id,
		id,
		email,
		error,
		status,
	};
};

export default useAuth;
