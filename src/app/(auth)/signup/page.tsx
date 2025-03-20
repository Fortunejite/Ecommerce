'use client';
import SimpleSnackbar from '@/components/snackbar';
import { errorHandler } from '@/lib/errorHandler';
import { Box, Button, Grid2, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  useEffect(() => {
    if (formErrors.general?.length) setSnackbarOpen(true);
    // Clear form errors when the component is mounted
    return () => setFormErrors({});
  }, [formErrors.general]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const { name, email, phoneNumber, password } = formData;

    if (name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }
    if (phoneNumber.trim().length < 6) {
      errors.phoneNumber = 'Phone Number must be at least 6 characters long';
    }
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
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('/api/auth/register', formData);
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (res?.error) {
        // Set a generic error if sign in fails
        setFormErrors((prev) => ({
          ...prev,
          general: res.error || 'Invalid credentials',
        }));
        return;
      }
      router.push('/');
    } catch (err) {
      console.error(err);
      // If error is an AxiosError, try to extract form errors from the API response.
      if (axios.isAxiosError(err)) {
        const apiMessage = err.response?.data?.message;
        if (apiMessage && typeof apiMessage === 'object') {
          setFormErrors(apiMessage);
        } else {
          setFormErrors((prev) => ({
            ...prev,
            general:
              (apiMessage as string) || 'An error occurred. Please try again.',
          }));
        }
      } else {
        setFormErrors((prev) => ({ ...prev, general: errorHandler(err) }));
      }
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
        <Typography variant='h5'>Create an Account</Typography>
        <Typography variant='body2'>Enter your details below</Typography>
      </Box>
      <TextField
        required
        label='Name'
        variant='standard'
        name='name'
        value={formData.name}
        error={!!formErrors.name}
        helperText={formErrors.name}
        onChange={handleChange}
        fullWidth
      />
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
        label='Phone Number'
        variant='standard'
        name='phoneNumber'
        value={formData.phoneNumber}
        error={!!formErrors.phoneNumber}
        helperText={formErrors.phoneNumber}
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
      {formErrors.general && (
        <Typography variant='body2' color='error'>
          {formErrors.general}
        </Typography>
      )}
      <Button
        type='submit'
        variant='contained'
        disabled={loading}
        fullWidth
        sx={{ mt: 2 }}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      <Typography variant='body1' align='center' mt={2}>
        Already have an account?{' '}
        <Link href='/login' style={{ textDecoration: 'underline' }}>
          Login
        </Link>
      </Typography>
      <SimpleSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={formErrors.general}
      />
    </Grid2>
  );
};

export default Signup;
