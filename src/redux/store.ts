import { configureStore } from '@reduxjs/toolkit';
import favouriteReducer from './favouriteSlice';
import brandReducer from './brandSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    brand: brandReducer,
    favourite: favouriteReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
