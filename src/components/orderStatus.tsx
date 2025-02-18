import { IOrder } from '@/models/Order.model';
import { Box, styled, Typography } from '@mui/material';

interface Props {
  status: IOrder['status'];
}

const StatusContainer = styled(Box)({
  padding: '4px',
  width: 'fit-content',
  borderRadius: '4px',
});
const StatusText = styled(Typography)({
  color: '#ffffff',
  textTransform: 'uppercase',
});

const OrderStatus = ({ status }: Props) => {
  if (status === 'processing') {
    return (
      <StatusContainer bgcolor={'#ffa500'}>
        <StatusText variant='body2'>{status}</StatusText>
      </StatusContainer>
    );
  } else if (status === 'shipped') {
    return (
      <StatusContainer bgcolor={'#00005f'}>
        <StatusText variant='body2'>{status}</StatusText>
      </StatusContainer>
    );
  } else if (status === 'delivered') {
    return (
      <StatusContainer bgcolor={'#008000'}>
        <StatusText variant='body2'>{status}</StatusText>
      </StatusContainer>
    );
  } else {
    return (
      <StatusContainer bgcolor={'#c30000'}>
        <StatusText variant='body2'>{status}</StatusText>
      </StatusContainer>
    );
  }
};

export default OrderStatus;
