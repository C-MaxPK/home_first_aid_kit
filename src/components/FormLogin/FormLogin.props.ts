import { Dispatch } from 'react';

export interface IFormLoginProps {
	showFormLogin: boolean;
	setShowFormLogin: Dispatch<React.SetStateAction<boolean>>;
}
