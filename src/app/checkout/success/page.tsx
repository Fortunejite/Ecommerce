'use client';
import { CheckCircleOutline } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const Success = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent='center'
      flexDirection={'column'}
      height={'50vh'}
    >
      <CheckCircleOutline fontSize='large' color='success' />
      <Typography>
        Your order has been recieved and would be attended to shortly. You can
        track the progress <Link href={`/orders/${orderId}`}>Here</Link>
      </Typography>
    </Box>
  );
};

export default Success;
