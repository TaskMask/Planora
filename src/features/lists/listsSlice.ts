import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { List, ListsState } from '../../types';

const initialState: ListsState = {
  lists: [],
  loading: false,
  error: null,
};

export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async (boardId: string) => {
    // TODO: Implement Firebase Firestore query
    console.log('Fetching lists for board:', boardId);
    return [] as List[];
  }
);

export const createList = createAsyncThunk(
  'lists/createList',
  async (listData: Partial<List>) => {
    // TODO: Implement Firebase Firestore create
    console.log('Creating list:', listData);
    return {} as List;
  }
);

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    reorderLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lists';
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      });
  },
});

export const { clearError, reorderLists } = listsSlice.actions;
export default listsSlice.reducer;
