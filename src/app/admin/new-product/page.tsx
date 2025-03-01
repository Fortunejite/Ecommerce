'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { errorHandler } from '@/lib/errorHandler';
import { Concentrations, FraganceFamily } from '@/lib/perfumeDetails';
import {
  Box,
  Stack,
  TextField,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
  Grid2,
  InputAdornment,
  Button,
} from '@mui/material';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

const NewProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: undefined,
    concentration: undefined,
    fragranceFamily: undefined,
    gender: undefined,
    stock: 1,
    size: undefined,
    price: undefined,
    discount: undefined,

  });
    const [loading, setLoading] = useState(false);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { brands } = useAppSelector((state) => state.brand);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    console.log(formData)
    setLoading(true);
    
        try {
          // const res = await signIn('credentials', {
          //   email: formData.email,
          //   password: formData.password,
          //   redirect: false,
          // });
    
          // if (res?.error) {
          //   setSnackbarOpen(true);
          //   return;
          // }
    
          // router.push(params.get('callback') || '/');
        } catch (error) {
          console.error(errorHandler(error));
        } finally {
          setLoading(false);
        }
  }

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Typography variant='h6'>Add a new Perfume</Typography>
      <Grid2 container component={'form'} spacing={2} onSubmit={handleSubmit}>
        <Grid2 size={12} my={2}>
          <TextField
            required
            label='Perfume Name'
            variant='standard'
            name='name'
            value={formData.name}
            error={!!formErrors.name}
            helperText={formErrors.name}
            onChange={handleChange}
            fullWidth
          />
        </Grid2>
        <Grid2 size={12}>
          <FormControl fullWidth required>
            <InputLabel>Brand</InputLabel>
            <Select
              value={formData.brand}
              name='brand'
              onChange={handleChange}
            >
              <MenuItem value={undefined}>Select Brand</MenuItem>
              {brands.map((brand) => (
                <MenuItem
                  key={brand._id.toString()}
                  value={brand._id.toString()}
                >
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel>Concentration</InputLabel>
            <Select
              value={formData.concentration}
              name='concentration'
              onChange={handleChange}
            >
              <MenuItem value={undefined}>Select Concentration</MenuItem>
              {Concentrations.map((concentration) => (
                <MenuItem key={concentration} value={concentration}>
                  {concentration}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel>Fragrance Family</InputLabel>
            <Select
              value={formData.fragranceFamily}
              name='fragranceFamily'
              onChange={handleChange}
            >
              <MenuItem value={undefined}>Select Fragrance Family</MenuItem>
              {FraganceFamily.map((fragrance) => (
                <MenuItem key={fragrance} value={fragrance}>
                  {fragrance}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              name='gender'
              onChange={handleChange}
            >
              <MenuItem value={undefined}>Select Gender</MenuItem>
              {['Men', 'Women', 'Unisex'].map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 3 }}>
          <TextField
            required
            label='Size'
            name='size'
            type='number'
            value={formData.size}
            error={!!formErrors.size}
            helperText={formErrors.size}
            onChange={handleChange}
            fullWidth
            slotProps={{
              htmlInput: {
                min: 0,
              },
              input: {
                endAdornment: (
                  <InputAdornment position='end'>ML</InputAdornment>
                ),
              },
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 3 }}>
          <TextField
            required
            label='Stock'
            name='stock'
            type='number'
            value={formData.stock}
            error={!!formErrors.stock}
            helperText={formErrors.stock}
            onChange={handleChange}
            fullWidth
            slotProps={{
              htmlInput: {
                min: 1,
              },
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 3 }}>
          <TextField
            required
            label='Price'
            name='price'
            type='number'
            value={formData.price}
            error={!!formErrors.price}
            helperText={formErrors.price}
            onChange={handleChange}
            fullWidth
            slotProps={{
              htmlInput: {
                min: 0,
              },
              input: {
                startAdornment: (
                  <InputAdornment position='start'>₦</InputAdornment>
                ),
              },
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 3 }}>
          <TextField
            label='Discount'
            name='discount'
            type='number'
            value={formData.discount}
            error={!!formErrors.discount}
            helperText={formErrors.discount}
            onChange={handleChange}
            fullWidth
            slotProps={{
              htmlInput: {
                max: 100,
                min: 0,
              },
              input: {
                endAdornment: <InputAdornment position='end'>%</InputAdornment>,
              },
            }}
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            required
            label='Perfume Description'
            name='description'
            value={formData.description}
            error={!!formErrors.description}
            helperText={formErrors.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={6}
          />
        </Grid2>
        <Button type='submit' variant='contained' fullWidth size='large'>Add Perfume</Button>
      </Grid2>
    </Stack>
  );
};
export default NewProduct;
