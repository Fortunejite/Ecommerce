import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { errorHandler } from '@/lib/errorHandler';
import axios from 'axios';
import { IProduct } from '@/models/Product.model';

interface IInitialState {
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  products: IProduct[];
}

// Thunks for handling async operations
export const fetchFavourite = createAsyncThunk(
  'favourite/fetchFavourite',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/favorites');
      return response.data;
    } catch (error) {
      const errorMessage = errorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const toggleFavourite = createAsyncThunk(
  'favourite/toggleFavourite',
  async (productId: IProduct['_id'], { rejectWithValue, getState }) => {
    const { favourite } = getState() as {
      favourite: IInitialState;
    };
    const isFavourite = favourite.products.find(
      (product) => product._id === productId,
    );
    try {
      if (isFavourite) {
        const response = await axios.delete(`/api/favorites/${productId}`);
        return response.data;
      } else {
        const response = await axios.post('/api/favorites/', {
          productId: productId.toString(),
        });
        return response.data;
      }
    } catch (error) {
      const errorMessage = errorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

const initialState: IInitialState = {
  products: [],
  status: 'idle',
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchFavourite
    builder
      .addCase(fetchFavourite.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavourite.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchFavourite.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle toggleFavourite
    builder
      .addCase(toggleFavourite.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(toggleFavourite.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const selectIsFavourite = (
  state: {
    favourite: IInitialState;
  },
  productId: IProduct['_id'],
) => !!state.favourite.products.find((product) => product._id === productId);

export default favoriteSlice.reducer;
