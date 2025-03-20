'use client';

import Product from '@/components/product';
import ProductSkeleton from '@/components/productSkeleton';
import { errorHandler } from '@/lib/errorHandler';
import { IProduct } from '@/models/Product.model';
import { Box, Grid2, Pagination, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const Search = () => {
  const query = useSearchParams().get('q');
  const [results, setResults] = useState<IProduct[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const LIMIT = 8;
  const pageCount = Math.ceil(count / LIMIT) || 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/search?q=${query}&limit=${LIMIT}&page=${currentPage}`;
      const { data } = await axios.get(url);
      const { results, totalCount } = data;
      setResults(results);
      setCount(totalCount);
    } catch (e) {
      console.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  }, [currentPage, query]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const changePage = (e: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  if (loading)
    return (
      <Stack gap={2} p={{ xs: 1, sm: 4 }}>
        <Grid2 container spacing={2} my={2}>
          {Array.from({ length: LIMIT }).map((_, i) => (
            <Grid2 key={i} size={{ xs: 6, sm: 3 }}>
              <ProductSkeleton />
            </Grid2>
          ))}
        </Grid2>
      </Stack>
    );

  return (
    <Stack gap={2} p={{ xs: 1, sm: 4 }}>
      <Typography variant="h6">Result for &quot;{query}&quot;</Typography>
      {results.length > 0 ? (
        <Grid2 container spacing={2} my={2}>
          {results.map((product) => (
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
        <Pagination count={pageCount} page={currentPage} shape="rounded" onChange={changePage} />
      </Box>
    </Stack>
  );
};

export default Search;
