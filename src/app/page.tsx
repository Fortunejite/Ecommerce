'use client';

import Product from '@/components/product';
import ProductSkeleton from '@/components/productSkeleton';
import Section from '@/components/section';
import { errorHandler } from '@/lib/errorHandler';
import { IProduct } from '@/models/Product.model';
import { Button, Grid2, Stack } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [topSelling, setTopSelling] = useState<IProduct[]>([]);
  const [topDeals, setTopDeals] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [products, topSelling, topDeals] = await Promise.all([
          axios.get('/api/products?limit=8'),
          axios.get('/api/products/top-selling?limit=4'),
          axios.get('/api/products/top-deals?limit=4'),
        ]);
        setProducts(products.data.products);
        setTopSelling(topSelling.data);
        setTopDeals(topDeals.data);
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
      {topSelling.length && (
        <Section title='Top selling products' subtitle='Top Selling'>
            {topSelling.map((product) => (
              <Grid2 key={product._id.toString()} size={{ xs: 6, sm: 3 }}>
                <Product product={product} />
              </Grid2>
            ))}
        </Section>
      )}
      {topDeals.length && (
        <Section title='Top discounts' subtitle='Top Deals'>
            {topDeals.map((product) => (
              <Grid2 key={product._id.toString()} size={{ xs: 6, sm: 3 }}>
                <Product product={product} />
              </Grid2>
            ))}
        </Section>
      )}
      <Section title='Explore our products' subtitle='Our Products'>
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
        <Button
          sx={{ display: 'block', mx: 'auto' }}
          variant='contained'
          onClick={() => router.push('/products')}
        >
          View All Products
        </Button>
      </Section>
    </Stack>
  );
}
