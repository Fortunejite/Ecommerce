import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { errorHandler } from '@/lib/errorHandler';
import axios from 'axios';
import { IProduct } from '@/models/Product.model';
import { ICart } from '@/models/Cart.model';

interface IInitialState {
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  items: ICart['items'];
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
    const isCart = cart.items.find(
      (item) => (item.product as IProduct)._id === productId,
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
export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { productId, quantity }: { productId: IProduct['_id']; quantity: number },
    { rejectWithValue, getState },
  ) => {
    const { cart } = getState() as {
      cart: IInitialState;
    };
    const isCart = cart.items.find(
      (item) => (item.product as IProduct)._id === productId,
    );
    try {
      if (isCart) {
        const response = await axios.patch(`/api/cart/${productId}`, {
          quantity,
        });
        return response.data;
      } else {
        return rejectWithValue('Item not found');
      }
    } catch (error) {
      const errorMessage = errorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

const initialState: IInitialState = {
  items: [] as unknown as ICart['items'],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state: IInitialState) => {
      state.items = [] as unknown as ICart['items'];
    },
  },
  extraReducers: (builder) => {
    // Handle fetchCart
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
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
        state.items = action.payload;
      })
      .addCase(toggleCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Handle updateQuantity
    builder
      .addCase(updateQuantity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
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
) =>
  !!state.cart.items.find(
    (item) => (item.product as IProduct)?._id === productId,
  );

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
