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
import businessInfo from '@/businessInfo.json';
import React from 'react';
import Link from 'next/link';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 32px',
  gap: '16px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: '8px',
  },
}));
const StyledTypography = styled(Typography)({
  color: '#FFFFFF',
});

const Footer = () => {
  return (
    <Box flex={1} bgcolor='#121212'>
      <StyledBox>
        <Stack gap={1}>
          <StyledTypography variant='h4'>{businessInfo.name}</StyledTypography>
          <StyledTypography variant='h6'>Subscribe</StyledTypography>
          <StyledTypography variant='body2' color='#FFFFFF'>
            Get 10% off your first order
          </StyledTypography>
          <FormControl>
            <InputLabel htmlFor='email'>Enter your email</InputLabel>
            <OutlinedInput
              id='email'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton>
                    <Send color='#FFFFFF' />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
        <Stack gap={1}>
          <StyledTypography variant='h6'>Support</StyledTypography>
          <StyledTypography variant='body2'>
            {businessInfo.address}
          </StyledTypography>
          <StyledTypography variant='body2'>
            {businessInfo.email}
          </StyledTypography>
          <StyledTypography variant='body2'>
            {businessInfo.phone}
          </StyledTypography>
        </Stack>
        <Stack gap={1}>
          <StyledTypography variant='h6'>Account</StyledTypography>
          <Link href='/profile'>
            <StyledTypography variant='body2'>My Account</StyledTypography>
          </Link>
          <Link href='/login'>
            <StyledTypography variant='body2'>Login / Register</StyledTypography>
          </Link>
          <Link href='/cart'>
            <StyledTypography variant='body2'>Cart</StyledTypography>
          </Link>
          <Link href='/favourite'>
            <StyledTypography variant='body2'>Wishlist</StyledTypography>
          </Link>
          <Link href='/products'>
            <StyledTypography variant='body2'>Shop</StyledTypography>
          </Link>
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
        <Typography textAlign='center' variant='body2'>
          {' '}
          © Copyright {businessInfo.name} 2022. All right reserved
        </Typography>
      </Box>
    </Box>
  );
};
export default Footer;
