'use client';

import Product from '@/components/product';
import ProductSkeleton from '@/components/productSkeleton';
import Section from '@/components/section';
import { useAppSelector } from '@/hooks/redux.hook';
import { errorHandler } from '@/lib/errorHandler';
import { IProduct } from '@/models/Product.model';
import { Button, Grid2, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { categories } = useAppSelector((state) => state.category);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products?limit=8');
        const { products } = res.data;
        setProducts(products);
      } catch (e) {
        console.error(errorHandler(e));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Stack p={{ xs: 1, sm: 4 }} spacing={4}>
      <Section title="Browse By Category" subtitle="Categories">
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {categories.map(({ _id, name }) => (
            <Typography key={_id.toString()} variant="h6">
              {name}
            </Typography>
          ))}
        </Stack>
      </Section>
      <Section title="Explore our products" subtitle="Our Products">
        <Grid2 container spacing={2} my={2}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid2 key={i} size={{ xs: 6, sm: 3 }}>
                  <ProductSkeleton />
                </Grid2>
              ))
            : products.map((product) => (
                <Grid2 key={product._id.toString()} size={{ xs: 6, sm: 3 }}>
                  <Product product={product} />
                </Grid2>
              ))}
        </Grid2>
        <Button
          sx={{ display: 'block', mx: 'auto' }}
          variant="contained"
          onClick={() => router.push('/products')}
        >
          View All Products
        </Button>
      </Section>
    </Stack>
  );
}
