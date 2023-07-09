export interface ILoginProps {
	email: string;
	pass: string;
}

export interface ISetUserProps {
	id: string;
	email: null | string;
}

export interface IUserState {
	id: null | string;
	email: null | string;
	error: null | string;
	status: 'idle' | 'loading' | 'failed';
}
