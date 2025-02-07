'use client';
import SimpleSnackbar from '@/components/snackbar';
import { errorHandler } from '@/lib/errorHandler';
import { Box, Button, Grid2, TextField, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const { email,  password } = formData;
    const newErrors: Record<string, string> = {};

    if (!email.match(/\S+@\S+\.\S+/)) newErrors.email = 'Invalid email format';
    if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    setError(newErrors);
    return Object.entries(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
    setLoading(true);
    if (!validateForm()) return;

    const res = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false
    });
    if (res?.error) return setSnackbarOpen(true)
    router.push('/');
    } catch (e) {
      console.log(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid2
      size={{ xs: 12, sm: 6 }}
      component={'form'}
      p={{ xs: 2, sm: 8 }}
      gap={1}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
      onSubmit={handleSubmit}
    >
      <Box>
        <Typography variant='h5'>Login to Exclusive</Typography>
        <Typography variant='body2'>Enter your details below</Typography>
      </Box>
      <TextField
        required
        label='Email'
        variant='standard'
        name='email'
        value={formData.email}
        error={!!error.email}
        helperText={error.email}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        required
        label='Password'
        variant='standard'
        name='password'
        type='password'
        value={formData.password}
        error={!!error.password}
        helperText={error.password}
        onChange={handleChange}
        fullWidth
      />
      <Button type='submit' variant='contained' disabled={loading} fullWidth>
        Login
      </Button>
      <SimpleSnackbar open={snackbarOpen} setOpen={setSnackbarOpen} message='Invalid credentials'/>
    </Grid2>
  );
};
export default Signup;
