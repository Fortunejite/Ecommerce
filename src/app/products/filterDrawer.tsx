'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { errorHandler } from '@/lib/errorHandler';
import { ICategory } from '@/models/Category.model';
import { IProduct } from '@/models/Product.model';
import { ITag } from '@/models/Tag.model';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Rating,
  Stack,
  styled,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

interface DrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setProducts: (products: IProduct[]) => void;
  setCount: (count: number) => void;
  setQueryString: (query: string) => void;
}

const Section = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: '16px 0',
});

const FilterDrawer = ({
  open,
  setOpen,
  setProducts,
  setCount,
  setQueryString,
  setLoading,
}: DrawerProps) => {
  const [filters, setFilters] = useState({
    ratings: 0,
    minPrice: 0,
    maxPrice: 0,
    categories: [] as ICategory['_id'][],
    tags: [] as ITag['_id'][],
  });
  const { categories } = useAppSelector((state) => state.category);
  const { tags } = useAppSelector((state) => state.tag);
  const LIMIT = 8;

  const toggleTag = (id: ITag['_id']) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(id)
        ? prev.tags.filter((tag) => tag !== id)
        : [...prev.tags, id],
    }));
  };

  const toggleCategory = (id: ICategory['_id']) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((cat) => cat !== id)
        : [...prev.categories, id],
    }));
  };

  const applyFilters = async () => {
    const params = new URLSearchParams();
    setOpen(false);

    if (filters.ratings) params.append('ratings', filters.ratings.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.categories.length)
      params.append('categories', filters.categories.join(','));
    if (filters.tags.length) params.append('tags', filters.tags.join(','));
    params.append('limit', LIMIT.toString());

    const queryString = params.toString();
    setQueryString(queryString);
    try {
      setLoading(true);
      const res = await axios.get(`/api/products?${queryString}`);
      const { products, totalCount } = res.data;
      setProducts(products);
      setCount(totalCount);
    } catch (e) {
      console.log(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    try {
      setLoading(true);
      setOpen(false);
      setFilters({
        ratings: 0,
        minPrice: 0,
        maxPrice: 0,
        categories: [],
        tags: [],
      });
      setQueryString('');
      const res = await axios.get(`/api/products?limit=${LIMIT}`);
      const { products, totalCount } = res.data;
      setProducts(products);
      setCount(totalCount);
    } catch (e) {
      console.log(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Box width={{ xs: '100vw', sm: 350 }} p={2}>
        <IconButton onClick={() => setOpen(false)}>
          <Close />
        </IconButton>
        <Section>
          <Typography variant="h6">Categories</Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {categories.map((category) => (
              <Chip
                key={category._id.toString()}
                variant={
                  filters.categories.includes(category._id)
                    ? 'filled'
                    : 'outlined'
                }
                onClick={() => toggleCategory(category._id)}
                label={category.name}
              />
            ))}
          </Stack>
        </Section>
        <Section>
          <Typography variant="h6">Tags</Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {tags.map((tag) => (
              <Chip
                key={tag._id.toString()}
                variant={filters.tags.includes(tag._id) ? 'filled' : 'outlined'}
                onClick={() => toggleTag(tag._id)}
                label={tag.name}
              />
            ))}
          </Stack>
        </Section>
        <Section>
          <Typography variant="h6">Ratings</Typography>
          <Rating
            precision={0.5}
            value={filters.ratings}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                ratings: Number((e.target as HTMLInputElement).value) || 0,
              }))
            }
          />
        </Section>
        <Section>
          <Typography variant="h6">Price</Typography>
          <Stack direction="row" gap={1}>
            <TextField
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: Number(e.target.value) || 0,
                }))
              }
              label="Min Price"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <TextField
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: Number(e.target.value) || 0,
                }))
              }
              label="Max Price"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Stack>
        </Section>
        <Box>
          <Button
            sx={{ width: '50%' }}
            variant="contained"
            onClick={applyFilters}
          >
            Apply
          </Button>
          <Button sx={{ width: '50%' }} onClick={resetFilters}>
            Reset
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default FilterDrawer;
