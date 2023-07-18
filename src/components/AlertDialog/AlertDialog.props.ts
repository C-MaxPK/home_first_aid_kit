import { Dispatch } from 'react';

export interface IAlertDialogProps {
	showAlertDialog: boolean;
	setShowAlertDialog: Dispatch<React.SetStateAction<boolean>>;
	submitHandler: () => void;
	name: string;
}
