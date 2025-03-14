'use client';
import SimpleSnackbar from '@/components/snackbar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';
import { IBrand } from '@/models/Brand.model';
import { addBrand, deleteBrand, modifyBrand } from '@/redux/brandSlice';
import { Delete, Edit } from '@mui/icons-material';
import {
  Breadcrumbs,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

const Brands = () => {
  const { brands, status } = useAppSelector((state) => state.brand);
  const [newBrand, setNewBrand] = useState('');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<IBrand | null>(null);
  const loading = status === 'loading';
  const dispatch = useAppDispatch();

  return (
    <Stack p={{ xs: 1, sm: 4 }} spacing={2}>
      <Breadcrumbs>
        <Link href='/admin'>Admin</Link>
        <Typography>Brands</Typography>
      </Breadcrumbs>
      <Stack direction='row' spacing={2}>
        <TextField
          label='Brand Name'
          name='brand'
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button
          variant='contained'
          disabled={loading}
          onClick={async () => {
            if (!newBrand.length) {
              setMessage('Brand name cannot be empty');
              setSnackbarOpen(true);
              return;
            }
            await dispatch(addBrand(newBrand));
            setNewBrand('');
          }}
        >
          Add Brand
        </Button>
      </Stack>
      <Table size='medium'>
        <TableHead>
          <TableRow>
            <TableCell>Brand Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand._id.toString()}>
              <TableCell>
                {activeBrand && activeBrand._id === brand._id ? (
                  <TextField
                    required
                    name='brand'
                    value={activeBrand.name}
                    onChange={(e) =>
                      setActiveBrand((prev) => ({
                        ...prev,
                        name: e.target.value as string,
                      } as IBrand))
                    }
                    sx={{ flex: 1 }}
                  />
                ) : (
                  <Typography>{brand.name}</Typography>
                )}
              </TableCell>
              <TableCell>
                {activeBrand && activeBrand._id === brand._id ? (
                  <Button
                    variant='contained'
                    disabled={loading}
                    onClick={async () => {
                      await dispatch(
                        modifyBrand({
                          id: brand._id.toString(),
                          name: activeBrand.name,
                        }),
                      );
                      setActiveBrand(null);
                    }}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Stack direction='row' spacing={1}>
                    <IconButton disabled={loading}>
                      <Edit onClick={() => setActiveBrand(brand)} />
                    </IconButton>
                    <IconButton
                      disabled={loading}
                      onClick={async () => {
                        await dispatch(deleteBrand(brand._id.toString()));
                        setActiveBrand(null);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <SimpleSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={message}
      />
    </Stack>
  );
};

export default Brands;
