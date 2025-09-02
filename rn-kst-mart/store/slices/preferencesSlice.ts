import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortType = 'price' | 'name' | 'rating';
export type ViewType = 'grid' | 'list';

interface PreferencesState {
  sort: SortType;
  filter: string;
  view: ViewType;
}

const initialState: PreferencesState = {
  sort: 'price',
  filter: '',
  view: 'grid',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<SortType>) {
      state.sort = action.payload;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
    setView(state, action: PayloadAction<ViewType>) {
      state.view = action.payload;
    },
  },
});

export const { setSort, setFilter, setView } = preferencesSlice.actions;
export default preferencesSlice.reducer;
