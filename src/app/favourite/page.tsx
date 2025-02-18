'use client';

import { Button, Grid2, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux.hook';
import FavoriteProduct from '@/components/favouriteProduct';

export default function Wishlist() {
  const { products } = useAppSelector((state) => state.favourite);
  const router = useRouter();
  const count = products.length;

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Typography variant="h6">Wishlist ({count})</Typography>
      {count > 0 ? (
        <Grid2 container spacing={2} my={2}>
          {products.map((product) => (
            <Grid2 key={product._id.toString()} size={{ xs: 6, sm: 3 }}>
              <FavoriteProduct product={product} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Stack alignItems="center" justifyContent="center" gap={3} mt={4}>
          <Typography variant="h6" align="center">
            No favourite product yet.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/products')}>
            Explore our products
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
