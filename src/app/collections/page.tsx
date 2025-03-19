'use client';

import {
  Box,
  Button,
  Grid2,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
  const params = useSearchParams();
  
  // Build initial query string conditionally
  const field = params.get('field');
  const value = params.get('value');
  const initialParams = new URLSearchParams();
  if (field && value) {
    initialParams.append(field, value);
  }
  
  const [queryString, setQueryString] = useState(initialParams.toString());
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const LIMIT = 8;
  const pageCount = Math.ceil(count / LIMIT) || 1;
  const title = params.get('title') || 'All Fragrance & Perfume';

  // Reset current page whenever queryString changes
  useEffect(() => {
    setCurrentPage(1);
  }, [queryString]);

  // Compute filtersCount based solely on queryString changes
  const filtersCount = (() => {
    const params = new URLSearchParams(queryString);
    let count = 0;
    if (params.get('minPrice')) count++;
    if (params.get('maxPrice')) count++;
    ['brands', 'concentration', 'fragranceFamily', 'gender', 'size'].forEach(
      (key) => {
        const value = params.get(key);
        if (value) {
          count += value.split(',').filter(Boolean).length;
        }
      },
    );
    return count;
  })();

  // Fetch products based on current query and page
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/products?limit=${LIMIT}&page=${currentPage}&${queryString}`;
      const { data } = await axios.get(url);
      const { products, totalCount } = data;
      setProducts(products);
      setCount(totalCount);
    } catch (e) {
      console.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  }, [queryString, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const changePage = (e: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Stack p={{ xs: 1, sm: 4 }} spacing={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">{count} products</Typography>
        </Box>
        <Button
          variant="contained"
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
        filtersCount={filtersCount}
      />

      {loading ? (
        <Grid2 container spacing={2} my={2}>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <Grid2 key={i} size={{ xs: 6, sm: 3 }}>
              <ProductSkeleton />
            </Grid2>
          ))}
        </Grid2>
      ) : products.length > 0 ? (
        <Grid2 container spacing={2} my={2}>
          {products.map((product) => (
            <Grid2 key={product._id.toString()} size={{ xs: 6, sm: 3 }}>
              <Product product={product} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="h6" align="center">
          No results found
        </Typography>
      )}

      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Pagination
          count={pageCount}
          page={currentPage}
          shape="rounded"
          onChange={changePage}
        />
      </Box>
    </Stack>
  );
}