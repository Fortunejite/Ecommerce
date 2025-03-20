'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { errorHandler } from '@/lib/errorHandler';
import { Concentrations, Category } from '@/lib/perfumeDetails';
import { IBrand } from '@/models/Brand.model';
import { IProduct } from '@/models/Product.model';
import { Close, ExpandMore, Remove } from '@mui/icons-material';
import {
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  styled,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { ChangeEvent, useState } from 'react';
import MuiAccordion from '@mui/material/Accordion';

interface IFilters {
  availability?: boolean;
  brands: IBrand['_id'][];
  concentration: string[];
  category: string[];
  gender: string[];
  size: number[];
  minPrice: number;
  maxPrice: number;
}

interface DrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setProducts: (products: IProduct[]) => void;
  setCount: (count: number) => void;
  setQueryString: (query: string) => void;
  filtersCount: number;
}

const StyledAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const StyledAccordionDetails = styled(AccordionDetails)({
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
});

const FilterDrawer = ({
  open,
  setOpen,
  setProducts,
  setCount,
  setQueryString,
  setLoading,
  filtersCount,
}: DrawerProps) => {
  const [filters, setFilters] = useState<IFilters>({
    brands: [],
    concentration: [],
    category: [],
    gender: [],
    size: [],
    minPrice: 0,
    maxPrice: 0,
  });
  const { brands } = useAppSelector((state) => state.brand);
  const LIMIT = 8;

  // Generic toggle function for array-based filters
  const toggleFilterItem = <K extends keyof IFilters>(
    field: K,
    value: IFilters[K] extends Array<infer U> ? U : never,
  ) => {
    setFilters((prev) => {
      const current = prev[field] as string[];
      return {
        ...prev,
        [field]: current.includes(value as string)
          ? (current.filter((item) => item !== value) as IFilters[K])
          : ([...current, value] as IFilters[K]),
      };
    });
  };

  // Combined handler for min and max price changes
  const handlePriceChange =
    (field: 'minPrice' | 'maxPrice') => (e: ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({ ...prev, [field]: Number(e.target.value) || 0 }));
    };

  const applyFilters = async () => {
    const {
      minPrice,
      maxPrice,
      brands,
      concentration,
      category,
      gender,
      size,
    } = filters;
    const params = new URLSearchParams();
    setOpen(false);

    if (minPrice > 0) params.append('minPrice', minPrice.toString());
    if (maxPrice > 0) params.append('maxPrice', maxPrice.toString());
    if (brands.length) params.append('brands', brands.join(','));
    if (concentration.length)
      params.append('concentration', concentration.join(','));
    if (category.length)
      params.append('category', category.join(','));
    if (gender.length) params.append('gender', gender.join(','));
    if (size.length) params.append('size', size.join(','));
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
      console.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    try {
      setLoading(true);
      setOpen(false);
      setFilters({
        // availability: true,
        brands: [],
        concentration: [],
        category: [],
        gender: [],
        size: [],
        minPrice: 0,
        maxPrice: 0,
      });
      setQueryString('');
      const res = await axios.get(`/api/products?limit=${LIMIT}`);
      const { products, totalCount } = res.data;
      setProducts(products);
      setCount(totalCount);
    } catch (e) {
      console.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SwipeableDrawer
      anchor='right'
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Stack
        width={{ xs: '100vw', sm: 350 }}
        bgcolor='background.default'
        minHeight='100vh'
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            p: 1,
            backgroundColor: 'background.default',
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            zIndex: 6,
          }}
        >
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
          <Typography>
            Filters{filtersCount > 0 && `(${filtersCount})`}
          </Typography>
        </Box>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant='h6'>Brands</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand._id.toString()}
                label={brand.name}
                control={
                  <Checkbox
                    checked={filters.brands.includes(brand._id)}
                    onChange={() => toggleFilterItem('brands', brand._id)}
                  />
                }
              />
            ))}
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant='h6'>Concentrations</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            {Concentrations.map((conc) => (
              <FormControlLabel
                key={conc}
                label={conc}
                control={
                  <Checkbox
                    checked={filters.concentration.includes(conc)}
                    onChange={() => toggleFilterItem('concentration', conc)}
                  />
                }
              />
            ))}
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant='h6'>Category</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            {Category.map((frag) => (
              <FormControlLabel
                key={frag}
                label={frag}
                control={
                  <Checkbox
                    checked={filters.category.includes(frag)}
                    onChange={() => toggleFilterItem('category', frag)}
                  />
                }
              />
            ))}
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant='h6'>Gender</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            {['Men', 'Women', 'Unisex'].map((gen) => (
              <FormControlLabel
                key={gen}
                label={gen}
                control={
                  <Checkbox
                    checked={filters.gender.includes(gen)}
                    onChange={() => toggleFilterItem('gender', gen)}
                  />
                }
              />
            ))}
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant='h6'>Price</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            <Stack
              direction='row'
              gap={1}
              justifyContent='space-between'
              alignItems='center'
            >
              <TextField
                size='small'
                value={filters.minPrice}
                onChange={handlePriceChange('minPrice')}
                type='number'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>₦</InputAdornment>
                  ),
                }}
              />
              <Remove />
              <TextField
                size='small'
                value={filters.maxPrice}
                onChange={handlePriceChange('maxPrice')}
                type='number'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>₦</InputAdornment>
                  ),
                }}
              />
            </Stack>
          </StyledAccordionDetails>
        </StyledAccordion>

        <Box
          sx={{
            mt: 2,
            position: 'sticky',
            bottom: 0,
            p: 1,
            backgroundColor: 'background.default',
          }}
        >
          <Button sx={{ width: '50%' }} onClick={resetFilters}>
            Reset
          </Button>
          <Button
            sx={{ width: '50%' }}
            variant='contained'
            onClick={applyFilters}
          >
            Apply
          </Button>
        </Box>
      </Stack>
    </SwipeableDrawer>
  );
};

export default FilterDrawer;
