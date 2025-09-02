import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = { ids: number[] };
const initialState: State = { ids: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<number>) {
      const id = action.payload;
      const i = state.ids.indexOf(id);
      if (i >= 0) state.ids.splice(i, 1);
      else state.ids.push(id);
    },
    clear(state) {
      state.ids = [];
    },
  },
});

export const { toggle, clear } = favoritesSlice.actions;
export default favoritesSlice.reducer;
