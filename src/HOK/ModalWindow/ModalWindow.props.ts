import { Dispatch } from 'react';

export interface IModalWindowProps {
	showModal: boolean;
	setShowModal: Dispatch<React.SetStateAction<boolean>>;
	children: JSX.Element;
}
