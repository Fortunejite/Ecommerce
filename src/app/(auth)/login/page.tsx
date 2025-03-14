'use client';

import React, { ChangeEvent, FormEvent, useState, useCallback } from 'react';
import { Box, Button, Grid2, TextField, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import SimpleSnackbar from '@/components/snackbar';
import { errorHandler } from '@/lib/errorHandler';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validateForm = () => {
    const { email, password } = formData;
    const errors: Record<string, string> = {};

    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setSnackbarOpen(true);
        return;
      }

      router.push(params.get('callback') || '/');
    } catch (error) {
      console.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid2
      size={{ xs: 12, sm: 6 }}
      component='form'
      p={{ xs: 2, sm: 8 }}
      gap={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onSubmit={handleSubmit}
    >
      <Box mb={2}>
        <Typography variant='h5' component='h1'>
          Login to Exclusive
        </Typography>
        <Typography variant='body2'>Enter your details below</Typography>
      </Box>
      <TextField
        required
        label='Email'
        variant='standard'
        name='email'
        value={formData.email}
        error={!!formErrors.email}
        helperText={formErrors.email}
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
        error={!!formErrors.password}
        helperText={formErrors.password}
        onChange={handleChange}
        fullWidth
      />
      <Button
        type='submit'
        variant='contained'
        disabled={loading}
        fullWidth
        sx={{ mt: 2 }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      <Typography variant='body1' align='center' mt={2}>
        Don&apost have an account?{' '}
        <Link href='/signup' style={{ textDecoration: 'underline' }}>
          Signup
        </Link>
      </Typography>
      <SimpleSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message='Invalid credentials'
      />
    </Grid2>
  );
};

export default Login;
