import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { errorHandler } from '@/lib/errorHandler';
import axios from 'axios';
import { IBrand } from '@/models/Brand.model';

interface IInitialState {
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  brands: IBrand[];
}

// Thunks for handling async operations
export const fetchBrands = createAsyncThunk(
  'brand/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/brands');
      return response.data;
    } catch (error) {
      const errorMessage = errorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

const initialState: IInitialState = {
  brands: [],
  status: 'idle',
  error: null,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchBrands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default brandSlice.reducer;

export const getBrandByName = (
  state: {
    brand: IInitialState;
  },
  brandName: IBrand['name'],
) => state.brand.brands.find(brand => brand.name === brandName);

export const getBrandById = (
  state: {
    brand: IInitialState;
  },
  brandId: IBrand['_id'],
) => state.brand.brands.find(brand => brand._id === brandId);