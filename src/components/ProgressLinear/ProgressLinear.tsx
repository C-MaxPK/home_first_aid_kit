import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material';

const ProgressLinear = (props: LinearProgressProps & { value: number }): JSX.Element => {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ width: '100%', mr: 1 }}>
				<LinearProgress variant="determinate" {...props} color='success' />
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant="caption" color="text.secondary">{`${props.value}%`}</Typography>
			</Box>
		</Box>
	);
};

export default ProgressLinear;
