import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCirclePlus, faListCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../../store/hooks';
import useAuth from '../../hooks/useAuth';
import { logout } from '../../store/userSlice';
import { colorPrimary } from '../../constants/colors';
import FormDrugAddition from '../FormDrugAddition/FormDrugAddition';

const AvatarIcon = (): JSX.Element => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [showFormDrugAddition, setShowFormDrugAddition] = useState<boolean>(false); // показ формы добавления лекарства

	const dispatch = useAppDispatch();
	const navigate = useNavigate(); // hook для навигации
	const { email } = useAuth(); // hook проверки авторизации

	// обработчик открытия меню
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
		setAnchorEl(event.currentTarget);
	};

	// обработчик закрытия меню
	const handleClose = (): void => {
		setAnchorEl(null);
	};

	// обработчик открытия формы добавления лекарства
	const showFormHandler = (): void => {
		setShowFormDrugAddition(true);
		handleClose();
	};

	return (
		<div>
			<IconButton onClick={handleClick} size="small">
				<Avatar sx={{ bgcolor: colorPrimary }}>
					<FontAwesomeIcon icon={faUser} />
				</Avatar>
			</IconButton>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
			>
				<Typography color={colorPrimary} textAlign='center' marginBottom={1}>
					{email}
				</Typography>
				<Divider />
				<MenuItem onClick={showFormHandler}>
					<ListItemIcon>
						<FontAwesomeIcon icon={faCirclePlus} color={colorPrimary} size='lg' />
					</ListItemIcon>
					Добавить лекарство
				</MenuItem>
				<MenuItem onClick={() => navigate('inventory')}>
					<ListItemIcon>
						<FontAwesomeIcon icon={faListCheck} size='lg' />
					</ListItemIcon>
					Инвентаризация
				</MenuItem>
				<MenuItem onClick={() => dispatch(logout())}>
					<ListItemIcon>
						<FontAwesomeIcon icon={faArrowRightFromBracket} size='lg' />
					</ListItemIcon>
					Выход
				</MenuItem>
			</Menu>

			<FormDrugAddition showFormDrugAddition={showFormDrugAddition} setShowFormDrugAddition={setShowFormDrugAddition} />
		</div>
	);
};

export default AvatarIcon;
