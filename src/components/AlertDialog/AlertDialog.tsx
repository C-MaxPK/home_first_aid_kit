import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { IAlertDialogProps } from './AlertDialog.props';

const AlertDialog = ({ showAlertDialog, setShowAlertDialog, submitHandler, name }: IAlertDialogProps): JSX.Element => {
	// закрываем диалоговое окно
	const closeAlertDialog = () => {
		setShowAlertDialog(false);
	};

	return (
		<Dialog
			open={showAlertDialog}
			onClose={closeAlertDialog}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title" color='error' textAlign='center'>
				Удаление лекарства "{name}"
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Вы действительно хотите удалить лекарство?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeAlertDialog} color='success'>Нет</Button>
				<Button onClick={submitHandler} color='error'>Да</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AlertDialog;
