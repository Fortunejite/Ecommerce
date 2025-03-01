'use client';

import { useAppSelector } from '@/hooks/redux.hook';
import { errorHandler } from '@/lib/errorHandler';
import { Concentrations, FraganceFamily } from '@/lib/perfumeDetails';
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
import { ChangeEvent, useCallback, useState } from 'react';
import MuiAccordion from '@mui/material/Accordion';

interface IFilters {
  concentration: string[];
  fragranceFamily: string[];
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

const LIMIT = 8;

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
    concentration: [],
    fragranceFamily: [],
    gender: [],
    size: [],
    minPrice: 0,
    maxPrice: 0,
  });

  // Toggle an item in array-based filters
  const toggleFilterItem = useCallback(
    <K extends keyof IFilters>(
      field: K,
      value: IFilters[K] extends Array<infer U> ? U : never,
    ) => {
      setFilters((prev) => {
        const current = prev[field] as unknown as any[];
        const updated = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        return { ...prev, [field]: updated as IFilters[K] };
      });
    },
    [],
  );

  // Handle changes for price fields
  const handlePriceChange = useCallback(
    (field: 'minPrice' | 'maxPrice') => (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value) || 0;
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // Build the query string and fetch filtered products
  const applyFilters = useCallback(async () => {
    const { minPrice, maxPrice, concentration, fragranceFamily, gender, size } = filters;
    const params = new URLSearchParams();
    setOpen(false);

    if (minPrice > 0) params.append('minPrice', minPrice.toString());
    if (maxPrice > 0) params.append('maxPrice', maxPrice.toString());
    if (concentration.length) params.append('concentration', concentration.join(','));
    if (fragranceFamily.length) params.append('fragranceFamily', fragranceFamily.join(','));
    if (gender.length) params.append('gender', gender.join(','));
    if (size.length) params.append('size', size.join(','));
    params.append('limit', LIMIT.toString());

    const queryString = params.toString();
    setQueryString(queryString);

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products?${queryString}`);
      const { products, totalCount } = data;
      setProducts(products);
      setCount(totalCount);
    } catch (e) {
      console.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  }, [filters, setOpen, setQueryString, setLoading, setProducts, setCount]);

  // Reset filters and reload the unfiltered products list
  const resetFilters = useCallback(async () => {
    try {
      setLoading(true);
      setOpen(false);
      setFilters({
        concentration: [],
        fragranceFamily: [],
        gender: [],
        size: [],
        minPrice: 0,
        maxPrice: 0,
      });
      setQueryString('');
      const { data } = await axios.get(`/api/products?limit=${LIMIT}`);
      const { products, totalCount } = data;
      setProducts(products);
      setCount(totalCount);
    } catch (e) {
      console.error(errorHandler(e));
    } finally {
      setLoading(false);
    }
  }, [setLoading, setOpen, setQueryString, setProducts, setCount]);

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Stack width={{ xs: '100vw', sm: 350 }} bgcolor="background.default" minHeight="100vh">
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
          <Typography>Filters{filtersCount > 0 && `(${filtersCount})`}</Typography>
        </Box>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Concentrations</Typography>
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
            <Typography variant="h6">Fragrance Family</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            {FraganceFamily.map((frag) => (
              <FormControlLabel
                key={frag}
                label={frag}
                control={
                  <Checkbox
                    checked={filters.fragranceFamily.includes(frag)}
                    onChange={() => toggleFilterItem('fragranceFamily', frag)}
                  />
                }
              />
            ))}
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Gender</Typography>
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
            <Typography variant="h6">Price</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            <Stack
              direction="row"
              gap={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <TextField
                size="small"
                value={filters.minPrice}
                onChange={handlePriceChange('minPrice')}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₦</InputAdornment>
                  ),
                }}
              />
              <Remove />
              <TextField
                size="small"
                value={filters.maxPrice}
                onChange={handlePriceChange('maxPrice')}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₦</InputAdornment>
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
          <Button sx={{ width: '50%' }} variant="contained" onClick={applyFilters}>
            Apply
          </Button>
        </Box>
      </Stack>
    </SwipeableDrawer>
  );
};

export default FilterDrawer;
