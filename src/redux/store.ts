import { configureStore } from '@reduxjs/toolkit';
import favouriteReducer from './favouriteSlice';
import categoryReducer from './categorySlice';
import tagReducer from './tagSlice';

const store = configureStore({
  reducer: {
    favourite: favouriteReducer,
    category: categoryReducer,
    tag: tagReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
