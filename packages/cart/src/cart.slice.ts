import { createSlice, createEntityAdapter, PayloadAction, EntityState } from '@reduxjs/toolkit';

export type CartItem = { id: number; title: string; price: number; qty: number };

const cartAdapter = createEntityAdapter<CartItem>({ selectId: (i: CartItem) => i.id });

type State = EntityState<CartItem>;

const slice = createSlice({
  name: 'cart',
  initialState: cartAdapter.getInitialState(),
  reducers: {
    upsert(state: State, action: PayloadAction<CartItem>) {
      cartAdapter.upsertOne(state, action.payload);
    },
    remove(state: State, action: PayloadAction<number>) {
      cartAdapter.removeOne(state, action.payload);
    },
    clear(state: State) {
      cartAdapter.removeAll(state);
    },
    increment(state: State, action: PayloadAction<number>) {
      const id = action.payload;
      const item = state.entities[id];
      if (item) cartAdapter.updateOne(state, { id, changes: { qty: item.qty + 1 } });
    },
    decrement(state: State, action: PayloadAction<number>) {
      const id = action.payload;
      const item = state.entities[id];
      if (item && item.qty > 1) cartAdapter.updateOne(state, { id, changes: { qty: item.qty - 1 } });
    },
  },
});

export const { upsert, remove, clear, increment, decrement } = slice.actions;
export const cartReducer = slice.reducer;
export const cartSelectors = cartAdapter.getSelectors<{ cart: State }>((s: { cart: State }) => s.cart);
