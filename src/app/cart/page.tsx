import {
  Breadcrumbs,
  Grid2,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';

const Cart = () => {
  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Breadcrumbs>
        <Link href={'/'}>Home</Link>
        <Typography>Cart</Typography>
      </Breadcrumbs>
    </Stack>
  );
};
export default Cart;
