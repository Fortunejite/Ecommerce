import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { errorHandler } from '@/lib/errorHandler';
import { IUser } from '@/models/User.model';
import axios from 'axios';
import { IProduct } from '@/models/Product.model';

interface IInitialState {
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  products: IProduct[];
}

// Thunks for handling async operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/cart');
      return response.data;
    } catch (error) {
      const errorMessage = errorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const toggleCart = createAsyncThunk(
  'cart/toggleCart',
  async (productId: IProduct['_id'], { rejectWithValue, getState }) => {
    const { cart } = getState() as {
      cart: IInitialState;
    };
    const isCart = cart.products.find(
      (product) => product._id === productId,
    );
    try {
      if (isCart) {
        const response = await axios.delete(`/api/cart/${productId}`);
        return response.data;
      } else {
        const response = await axios.post('/api/cart/', {
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
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle toggleCart
    builder
      .addCase(toggleCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(toggleCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(toggleCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const selectInCart = (
  state: {
    cart: IInitialState;
  },
  productId: IProduct['_id'],
) => !!state.cart.products.find((product) => product._id === productId);

export default favoriteSlice.reducer;
