import { createSlice, createEntityAdapter, PayloadAction, EntityState } from '@reduxjs/toolkit';

export type CartItem = { id: number; title: string; price: number; qty: number };

const cartAdapter = createEntityAdapter<CartItem>();

export type CartState = EntityState<CartItem, number>;

const slice = createSlice({
  name: 'cart',
  initialState: cartAdapter.getInitialState(),
  reducers: {
    upsert(state: CartState, action: PayloadAction<CartItem>) {
      cartAdapter.upsertOne(state, action.payload);
    },
    remove(state: CartState, action: PayloadAction<number>) {
      cartAdapter.removeOne(state, action.payload);
    },
    clear(state: CartState) {
      cartAdapter.removeAll(state);
    },
    increment(state: CartState, action: PayloadAction<number>) {
      const id = action.payload;
      const item = state.entities[id];
      if (item) cartAdapter.updateOne(state, { id, changes: { qty: item.qty + 1 } });
    },
    decrement(state: CartState, action: PayloadAction<number>) {
      const id = action.payload;
      const item = state.entities[id];
      if (item && item.qty > 1) cartAdapter.updateOne(state, { id, changes: { qty: item.qty - 1 } });
    },
  },
});

export const { upsert, remove, clear, increment, decrement } = slice.actions;
export const cartReducer = slice.reducer;
export const cartSelectors = cartAdapter.getSelectors<{ cart: CartState }>((s) => s.cart);
