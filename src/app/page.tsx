import Product from '@/components/product';
import Section from '@/components/section';
import { ICategory } from '@/models/Category.model';
import { IProduct } from '@/models/Product.model';
import { Box, Divider, Grid2, Stack, Typography } from '@mui/material';

export default async function Home() {
  const productRes = await fetch('http://localhost:3000/api/products?limit=8');
  const categoriesRes = await fetch('http://localhost:3000/api/categories');
  const products = (await productRes.json()).products as IProduct[];
  const categories = (await categoriesRes.json()) as ICategory[];

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Section title='Browse By Category' subtitle='Categories'>
        {categories.map(({ _id, name }) => (
          <Stack key={_id.toString()}>
            <Typography variant='h6'>{name}</Typography>
          </Stack>
        ))}
      </Section>
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
