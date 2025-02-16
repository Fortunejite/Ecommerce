'use client';
import { CheckCircleOutline } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

const SuccessText = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <Typography>
      Your order has been recieved and would be attended to shortly. You can
      track the progress <Link href={`/orders/${orderId}`}>Here</Link>
    </Typography>
  );
};

const Success = () => {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent='center'
      flexDirection={'column'}
      height={'50vh'}
    >
      <CheckCircleOutline fontSize='large' color='success' />
      <Suspense
        fallback={
          <Typography>
            Your order has been recieved and would be attended to shortly. You
            can track the progress Here
          </Typography>
        }
      >
        <SuccessText />
      </Suspense>
    </Box>
  );
};

export default Success;
