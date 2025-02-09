import Product from '@/components/product';
import Section from '@/components/section';
import { IProduct } from '@/models/Product.model';
import { Box, Grid2, Stack, Typography } from '@mui/material';

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/products');
  const products = (await res.json()) as IProduct[];

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Section title='Explore our products' subtitle='Our Products'>
        {products.map((product) => (
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Product key={product._id.toString()} product={product} />
          </Grid2>
        ))}
      </Section>
    </Stack>
  );
}
