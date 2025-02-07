'use client';
import { errorHandler } from '@/lib/errorHandler';
import { Box, Button, Grid2, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useState } from 'react';

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const { name, email, phoneNumber, password } = formData;
    const newErrors: Record<string, string> = {};

    if (name.length < 3)
      newErrors.name = 'Name must be at least 3 characters long';
    if (phoneNumber.length < 6)
      newErrors.phoneNumber = 'Phone Number must be at least 6 characters long';
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

    await axios.post('/api/auth/register', formData)
    const res = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false
    });
    if (res?.error) return console.log(res?.error)
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
        <Typography variant='h5'>Create an Account</Typography>
        <Typography variant='body2'>Enter your details below</Typography>
      </Box>
      <TextField
        required
        label='Name'
        variant='standard'
        name='name'
        value={formData.name}
        error={!!error.email}
        helperText={error.name}
        onChange={handleChange}
        fullWidth
      />
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
        label='Phone Number'
        variant='standard'
        name='phoneNumber'
        value={formData.phoneNumber}
        error={!!error.phoneNumber}
        helperText={error.phoneNumber}
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
        Create Account
      </Button>
      <Typography variant='body1'>
        Already have an account?{' '}
        <Link href={'/login'} style={{ textDecoration: 'underline' }}>
          Login
        </Link>
      </Typography>
    </Grid2>
  );
};
export default Signup;
