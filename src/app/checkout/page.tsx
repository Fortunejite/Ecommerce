import { Grid2, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

const Checkout = () => {
  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Grid2 container>
        <Grid2 size={{ xs: 12, sm: 6 }} spacing={1}>
          <Typography variant='h6'>Billing Details</Typography>
          <TextField fullWidth placeholder='Name' />
          <TextField fullWidth placeholder='Email Address' />
          <TextField fullWidth placeholder='Street Address' />
          <TextField fullWidth placeholder='Town/City' />
          <TextField fullWidth placeholder='Phone Number' />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}></Grid2>
      </Grid2>
    </Stack>
  );
};
export default Checkout;
