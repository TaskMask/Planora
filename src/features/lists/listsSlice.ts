import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { List, ListsState } from '../../types';

const initialState: ListsState = {
  lists: [],
  loading: false,
  error: null,
};

export const createListsFromTemplate = createAsyncThunk(
  'lists/createListsFromTemplate',
  async (data: { boardId: string; templateLists: any[] }, { rejectWithValue }) => {
    try {
      console.log('Creating lists from template:', data);
      
      const lists: List[] = data.templateLists.map((templateList, index) => ({
        id: `${Date.now()}-${index}`,
        title: templateList.title,
        boardId: data.boardId,
        position: index,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      console.log('Created lists from template:', lists);
      return { lists, templateLists: data.templateLists };
    } catch (error) {
      console.error('Error creating lists from template:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create lists');
    }
  }
);

export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async (boardId: string, { rejectWithValue }) => {
    try {
      console.log('Fetching lists for board:', boardId);
      
      // Return empty lists array for new boards
      const mockLists: List[] = [];
      
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading
      console.log('Returning empty lists for new board');
      return mockLists;
    } catch (error) {
      console.error('Error fetching lists:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch lists');
    }
  }
);

export const createList = createAsyncThunk(
  'lists/createList',
  async (listData: { title: string; boardId: string; position: number }, { rejectWithValue }) => {
    try {
      console.log('Creating list:', listData);
      
      // Create mock list
      const newList: List = {
        id: Date.now().toString(),
        title: listData.title,
        boardId: listData.boardId,
        position: listData.position,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('List created:', newList);
      return newList;
    } catch (error) {
      console.error('Error creating list:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create list');
    }
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
    moveList: (state, action: PayloadAction<{ listId: string; newPosition: number }>) => {
      const { listId, newPosition } = action.payload;
      const listIndex = state.lists.findIndex(list => list.id === listId);
      
      if (listIndex !== -1) {
        const list = state.lists[listIndex];
        // Update list position
        state.lists[listIndex] = {
          ...list,
          position: newPosition,
          updatedAt: new Date().toISOString(),
        };
        
        // Reorder other lists
        state.lists.forEach((l, index) => {
          if (l.id !== listId && index !== listIndex) {
            if (l.position >= newPosition) {
              state.lists[index] = {
                ...l,
                position: l.position + 1,
              };
            }
          }
        });
        
        // Sort lists by position
        state.lists.sort((a, b) => a.position - b.position);
      }
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
      })
      .addCase(createListsFromTemplate.fulfilled, (state, action) => {
        state.lists = action.payload.lists;
      });
  },
});

export const { clearError, reorderLists, moveList } = listsSlice.actions;
export default listsSlice.reducer;
