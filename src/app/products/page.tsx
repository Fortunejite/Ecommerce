'use client';

import {
  Box,
  Button,
  Grid2,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import FilterDrawer from './filterDrawer';
import { IProduct } from '@/models/Product.model';
import Product from '@/components/product';
import { Tune } from '@mui/icons-material';
import { errorHandler } from '@/lib/errorHandler';
import axios from 'axios';
import ProductSkeleton from '@/components/productSkeleton';
import { useSearchParams } from 'next/navigation';

export default function Products() {
  const [filterOpen, setFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const [queryString, setQueryString] = useState(searchParams.toString());
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const LIMIT = 8;
  const pageCount = Math.ceil(count / LIMIT) || 1;

  const URL = `/api/products?limit=${LIMIT}&${queryString}`;

  useEffect(() => {
    setCurrentPage(1);
  }, [count]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(URL);
        const { products, totalCount } = res.data;
        setProducts(products);
        setCount(totalCount);
      } catch (e) {
        console.log(errorHandler(e));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const changePage = async (e: ChangeEvent<unknown>, value: number) => {
    try {
      setCurrentPage(value);
      try {
        setLoading(true);
        const res = await axios.get(`${URL}&page=${value}`);
        const { products, totalCount } = res.data;
        setProducts(products);
        setCount(totalCount);
      } catch (e) {
        console.log(errorHandler(e));
      } finally {
        setLoading(false);
      }
    } catch (e) {
      console.log(errorHandler(e));
    }
  };

  return (
    <Stack p={{ xs: 1, sm: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h6'>Results({count})</Typography>
        <Button
          variant='contained'
          endIcon={<Tune />}
          onClick={() => setFilterOpen(true)}
        >
          Filter
        </Button>
      </Box>
      <FilterDrawer
        open={filterOpen}
        setOpen={setFilterOpen}
        setProducts={setProducts}
        setCount={setCount}
        setQueryString={setQueryString}
        setLoading={setLoading}
      />

      {loading ? (
        <Grid2 container spacing={2} marginBottom={2} marginTop={2}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
            <Grid2 key={i} size={{ xs: 6, sm: 3 }}>
              <ProductSkeleton />
            </Grid2>
          ))}
        </Grid2>
      ) : products.length ? (
        <Grid2 container spacing={2} marginBottom={2} marginTop={2}>
          {products.map((product, i) => (
            <Grid2 key={i} size={{ xs: 6, sm: 3 }}>
              <Product key={product._id.toString()} product={product} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant='h6' align='center'>
          No result Found
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pagination
          count={pageCount}
          page={currentPage}
          shape='rounded'
          onChange={changePage}
        />
      </Box>
    </Stack>
  );
}
