'use client';

import Product from '@/components/product';
import ProductSkeleton from '@/components/productSkeleton';
import Section from '@/components/section';
import { useAppSelector } from '@/hooks/redux.hook';
import { errorHandler } from '@/lib/errorHandler';
import { ICategory } from '@/models/Category.model';
import { IProduct } from '@/models/Product.model';
import { Box, Button, Divider, Grid2, Stack, Typography } from '@mui/material';
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
        console.log(errorHandler(e));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        {loading
          ? [1, 2, 3, 4].map(() => (
              <Grid2 size={{ xs: 6, sm: 3 }}>
                <ProductSkeleton />
              </Grid2>
            ))
          : products.map((product) => (
              <Grid2 size={{ xs: 6, sm: 3 }}>
                <Product key={product._id.toString()} product={product} />
              </Grid2>
            ))}
        <Button
          sx={{ margin: '0 auto' }}
          variant='contained'
          onClick={() => router.push('/products')}
        >
          View All Products
        </Button>
      </Section>
    </Stack>
  );
}
