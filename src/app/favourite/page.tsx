'use client';

import { Button, Grid2, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux.hook';
import FavoriteProduct from '@/components/favouriteProduct';

export default function Products() {
  const { products } = useAppSelector((state) => state.favourite);
  const router = useRouter();
  const count = products.length;

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Typography variant='h6'>Wishlist ({count})</Typography>
      {products.length ? (
        <Grid2 container spacing={2} marginBottom={2} marginTop={2}>
          {products.map((product, i) => (
            <Grid2 key={i} size={{ xs: 6, sm: 3 }}>
              <FavoriteProduct key={product._id.toString()} product={product} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Stack alignItems='center' justifyContent={'center'} gap={3}>
          <Typography variant='h6' align='center'>
            No favourite product yet.
          </Typography>
          <Button variant='contained' onClick={() => router.push('/products')}>
            Explore our products
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
