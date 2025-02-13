'use client';

import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { Send } from 'lucide-react';
import React from 'react';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 32px',
  gap: '16px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: '8px'
  },
}));
const StyledTypography = styled(Typography)( ({
  color: '#FFFFFF',
}));

const Footer = () => {
  return (
    <Box flex={1} bgcolor='#121212'>
      <StyledBox>
        <Stack gap={1}>
          <StyledTypography variant='h4'>Exclusive</StyledTypography>
          <StyledTypography variant='h6'>Subscribe</StyledTypography>
          <StyledTypography variant='body2' color='#FFFFFF'>Get 10% off your first order</StyledTypography>
          <FormControl>
            <InputLabel htmlFor='email'>Enter your email</InputLabel>
            <OutlinedInput
              id='email'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton>
                    <Send color='#FFFFFF'/>
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
        <Stack gap={1}>
          <StyledTypography variant='h6'>Support</StyledTypography>
          <StyledTypography variant='body2'>
            111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
          </StyledTypography>
          <StyledTypography variant='body2'>exclusive@gmail.com</StyledTypography>
          <StyledTypography variant='body2'>+88015-88888-9999</StyledTypography>
        </Stack>
        <Stack gap={1}>
          <StyledTypography variant='h6'>Account</StyledTypography>
          <StyledTypography variant='body2'>My Account</StyledTypography>
          <StyledTypography variant='body2'>Login / Register</StyledTypography>
          <StyledTypography variant='body2'>Cart</StyledTypography>
          <StyledTypography variant='body2'>Wishlist</StyledTypography>
          <StyledTypography variant='body2'>Shop</StyledTypography>
        </Stack>
        <Stack gap={1}>
          <StyledTypography variant='h6'>Account</StyledTypography>
          <StyledTypography variant='body2'>Privacy Policy</StyledTypography>
          <StyledTypography variant='body2'>Terms of use</StyledTypography>
          <StyledTypography variant='body2'>FAQ</StyledTypography>
          <StyledTypography variant='body2'>Contact</StyledTypography>
        </Stack>
      </StyledBox>
      <Divider />
      <Box p={2}>
      <Typography textAlign='center' variant='body2'> © Copyright Rimel 2022. All right reserved</Typography>
      </Box>
    </Box>
  );
};
export default Footer;
