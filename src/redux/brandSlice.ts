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

export const addBrand = createAsyncThunk(
  'brand/addBrand',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/admin/brands', { name });
      return response.data;
    } catch (error) {
      const errorMessage = errorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const modifyBrand = createAsyncThunk(
  'brand/modifyBrand',
  async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/admin/brands/${id}`, { name });
      return response.data;
    } catch (error) {
      const errorMessage = errorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteBrand = createAsyncThunk(
  'brand/deleteBrand',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/admin/brands/${id}`);
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

    // Handle addBrand
    builder
      .addCase(addBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.brands = [...state.brands, action.payload];
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle modifyBrand
    builder
      .addCase(modifyBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(modifyBrand.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.brands = state.brands.map((brand) => {
          if (brand._id === action.payload._id) {
            return action.payload;
          }
          return brand;
        });
      })
      .addCase(modifyBrand.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle deleteBrand
    builder
      .addCase(deleteBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.brands = state.brands.filter(
          (brand) => brand._id !== action.payload,
        );
      })
      .addCase(deleteBrand.rejected, (state, action) => {
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
) => state.brand.brands.find((brand) => brand.name === brandName);

export const getBrandById = (
  state: {
    brand: IInitialState;
  },
  brandId: IBrand['_id'] | string,
) => state.brand.brands.find((brand) => brand._id === brandId);
