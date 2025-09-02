import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import preferencesReducer from './slices/preferencesSlice';
import { cartReducer } from './cart.slice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    preferences: preferencesReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
