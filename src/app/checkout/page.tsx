'use client';

import PaystackPayment from '@/components/paystackPayment';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { clearCart } from '@/redux/cartSlice';
import { calculateTotalAmount, calculateTotalItems } from '@/lib/cartUtils';
import { formatNumber } from '@/lib/formatNumber';
import { IUser } from '@/models/User.model';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid2,
  Radio,
  RadioGroup,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { callback } from 'react-paystack/dist/types';

const PCCheckOutBtn = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));
const MobileCheckOutBtn = styled(Button)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    position: 'sticky',
    bottom: 0,
    display: 'block',
  },
}));

const Checkout = () => {
  const [profile, setProfile] = React.useState<IUser | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = React.useState<'paystack' | 'cash'>(
    'paystack',
  );
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phoneNumber: '',
  });
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const session = useSession();
  if (!session) router.push('/login?callback=/checkout');

  const user = session.data?.user;

  React.useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      const res = await axios.get('/api/profile');
      setProfile(res.data);
      setFormData((prev) => ({ ...prev, ...res.data }));
    };

    getProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.address.trim()) {
      errors.address = 'Street address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'Town/City is required';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number';
    }

    setError(errors);
    return Object.entries(errors).length === 0;
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      if (!validateForm()) return;
      const order = {
        paymentMethod,
        shipmentInfo: formData,
      };
      const res = await axios.post('/api/orders', order);
      dispatch(clearCart());
      router.push(`/checkout/success?orderId=${res.data._id}`);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: { reference: string }) => {
    try {
      setLoading(true);
      const order = {
        paymentMethod,
        paymentReference: response.reference,
        shipmentInfo: formData,
      };
      const res = await axios.post('/api/orders', order);
      dispatch(clearCart());
      router.push(`/checkout/success?orderId=${res.data._id}`);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Grid2
        container
        spacing={{ xs: 2, sm: 4 }}
        flexDirection={{ xs: 'column-reverse', sm: 'row' }}
        sx={{ position: 'relative' }}
      >
        <Grid2
          size={{ xs: 12, sm: 8 }}
          gap={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant='h6'>Billing Details</Typography>
          <TextField
            required
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={!!error.name}
            helperText={error.name}
            fullWidth
            label='Name'
          />
          <TextField
            required
            name='email'
            value={formData.email}
            error={!!error.email}
            helperText={error.email}
            onChange={handleChange}
            fullWidth
            label='Email Address'
          />
          <TextField
            required
            name='address'
            value={formData.address}
            onChange={handleChange}
            error={!!error.address}
            helperText={error.address}
            fullWidth
            label='Street Address'
          />
          <TextField
            required
            name='city'
            value={formData.city}
            onChange={handleChange}
            error={!!error.city}
            helperText={error.city}
            fullWidth
            label='Town/City'
          />
          <TextField
            required
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!error.phoneNumber}
            helperText={error.phoneNumber}
            fullWidth
            label='Phone Number'
          />
          <Box display={{ xs: 'block', sm: 'none' }}>
            <Typography variant={'h6'}>Payment Method</Typography>
            <FormControl>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as 'cash' | 'paystack')
                }
              >
                <FormControlLabel
                  value='paystack'
                  control={<Radio />}
                  label='Bank'
                />
                <FormControlLabel
                  value='cash'
                  control={<Radio />}
                  label='Pay on delivery'
                />
              </RadioGroup>
            </FormControl>
          </Box>
          {paymentMethod === 'cash' ? (
            <MobileCheckOutBtn
              size={'large'}
              onClick={placeOrder}
              variant='contained'
              disabled={loading}
            >
              {loading ? 'Processing Order' : 'Place order'}
            </MobileCheckOutBtn>
          ) : (
            <Box
              position='sticky'
              bottom={0}
              display={{ xs: 'block', sm: 'none' }}
            >
              <PaystackPayment
                email={formData.email}
                amount={calculateTotalAmount(items)}
                onSuccess={handlePaymentSuccess}
                validateForm={validateForm}
                loading={loading}
              />
            </Box>
          )}
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 4 }}
          position={{ xs: 'static', sm: 'sticky' }}
          sx={{ top: 32 }}
        >
          <Box>
            <Typography variant={'h6'}>Order Summary</Typography>
            <Divider />
            <Stack marginTop={2} direction='row' justifyContent='space-between'>
              <Typography>
                Item's total({calculateTotalItems(items)}):
              </Typography>
              <Typography variant={'h6'}>
                ₦{formatNumber(calculateTotalAmount(items))}
              </Typography>
            </Stack>
            <Stack marginTop={2} direction='row' justifyContent='space-between'>
              <Typography>Delivery fee:</Typography>
              <Typography variant={'h6'}>Free</Typography>
            </Stack>
            <Stack marginTop={2} direction='row' justifyContent='space-between'>
              <Typography variant={'h6'}>Total:</Typography>
              <Typography variant={'h6'}>
                ₦{formatNumber(calculateTotalAmount(items))}
              </Typography>
            </Stack>
            <Box marginTop={2} marginBottom={2}>
              <Divider />
              <Box display={{ xs: 'none', sm: 'block' }}>
                <Typography variant={'h6'}>Payment Method</Typography>
                <FormControl>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as 'cash' | 'paystack')
                    }
                  >
                    <FormControlLabel
                      value='paystack'
                      control={<Radio />}
                      label='Bank'
                    />
                    <FormControlLabel
                      value='cash'
                      control={<Radio />}
                      label='Pay on delivery'
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
            {paymentMethod === 'cash' ? (
              <PCCheckOutBtn
                size={'large'}
                onClick={placeOrder}
                variant='contained'
                fullWidth
                disabled={loading}
              >
                {loading ? 'Processing Order' : 'Place order'}
              </PCCheckOutBtn>
            ) : (
              <Box display={{ xs: 'none', sm: 'block' }}>
                <PaystackPayment
                  email={formData.email}
                  amount={calculateTotalAmount(items)}
                  validateForm={validateForm}
                  onSuccess={handlePaymentSuccess}
                  loading={loading}
                />
              </Box>
            )}
          </Box>
        </Grid2>
      </Grid2>
    </Stack>
  );
};
export default Checkout;
