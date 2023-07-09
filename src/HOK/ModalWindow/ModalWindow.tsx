import { Box, Modal } from '@mui/material';
import { IModalWindowProps } from './ModalWindow.props';

const ModalWindow = ({ showModal, setShowModal, children }: IModalWindowProps): JSX.Element => {
	const style = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		minWidth: 300,
		bgcolor: 'background.paper',
		borderRadius: '5px',
		border: 'none',
		boxShadow: 24,
		p: 3,
	};

	// обработчик закрытия модального окна
	const handleClose = (): void => {
		setShowModal(false);
	};

	return (
		<Modal
			open={showModal}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style}>
				{children}
			</Box>
		</Modal>
	);
};

export default ModalWindow;
