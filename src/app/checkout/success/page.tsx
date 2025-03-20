'use client';

import { CheckCircleOutline } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React, { Suspense } from 'react';

const SuccessText = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <Typography variant="body1" align="center" mt={2}>
      Your order has been received and will be attended to shortly. You can track
      its progress{' '}
      {orderId && (
        <Link href={`/orders/${orderId}`} style={{ textDecoration: 'underline' }}>
          here
        </Link>
      )}.
    </Typography>
  );
};

const Success = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="50vh"
      textAlign="center"
      px={2}
    >
      <CheckCircleOutline fontSize="large" color="success" />
      {/* Wrap SuccessText in Suspense */}
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <SuccessText />
      </Suspense>
    </Box>
  );
};

export default Success;
