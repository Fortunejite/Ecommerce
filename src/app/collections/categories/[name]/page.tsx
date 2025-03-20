'use client';

import { Box, Button, Grid2, Pagination, Stack, Typography } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import FilterDrawer from './filterDrawer';
import { IProduct } from '@/models/Product.model';
import Product from '@/components/product';
import { Tune } from '@mui/icons-material';
import { errorHandler } from '@/lib/errorHandler';
import axios from 'axios';
import ProductSkeleton from '@/components/productSkeleton';
import { useParams } from 'next/navigation';

export default function Products() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Retrieve and decode the URL parameter for fragrance family
  const { name: nameParam } = useParams();
  const name = decodeURIComponent((nameParam as string) || '');

  const LIMIT = 8;
  const pageCount = Math.ceil(count / LIMIT) || 1;

  // Reset the current page when the query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [queryString]);

  // Calculate the number of active filters from the query string
  const filtersCount = useMemo(() => {
    const searchParams = new URLSearchParams(queryString);
    let count = 0;
    if (searchParams.get('minPrice')) count++;
    if (searchParams.get('maxPrice')) count++;
    ['brands', 'concentration', 'category', 'gender', 'size'].forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        count += value.split(',').filter(Boolean).length;
      }
    });
    return count;
  }, [queryString]);

  // Fetch products based on the current page, query, and fragrance family
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const category = encodeURIComponent(name);
      const url = `/api/products?limit=${LIMIT}&page=${currentPage}&category=${category}&${queryString}`;
      const { data } = await axios.get(url);
      setProducts(data.products);
      setCount(data.totalCount);
    } catch (error) {
      console.error(errorHandler(error));
    } finally {
      setLoading(false);
    }
  }, [queryString, currentPage, name]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
    },
    []
  );

  return (
    <Stack p={{ xs: 1, sm: 4 }} spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Category - {name}</Typography>
          <Typography variant="body2">{count} products</Typography>
        </Box>
        <Button variant="contained" endIcon={<Tune />} onClick={() => setFilterOpen(true)}>
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

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Pagination count={pageCount} page={currentPage} shape="rounded" onChange={handlePageChange} />
      </Box>
    </Stack>
  );
}
