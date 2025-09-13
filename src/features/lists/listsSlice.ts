import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { List, ListsState } from '../../types';

// Helper functions for localStorage
const LISTS_STORAGE_KEY = 'planora_lists';

const saveListsToStorage = (lists: List[]) => {
  try {
    localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
  } catch (error) {
    console.error('Failed to save lists to localStorage:', error);
  }
};

const loadListsFromStorage = (): List[] => {
  try {
    const stored = localStorage.getItem(LISTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load lists from localStorage:', error);
    return [];
  }
};

const getUserSpecificStorageKey = (userId: string) => `planora_lists_${userId}`;

const saveListsToUserStorage = (lists: List[], userId: string) => {
  try {
    localStorage.setItem(getUserSpecificStorageKey(userId), JSON.stringify(lists));
  } catch (error) {
    console.error('Failed to save lists to localStorage:', error);
  }
};

const loadListsFromUserStorage = (userId: string): List[] => {
  try {
    const stored = localStorage.getItem(getUserSpecificStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load lists from localStorage:', error);
    return [];
  }
};

// Default lists for new boards
const createDefaultLists = (boardId: string): List[] => {
  const defaultLists = [
    { title: 'To Do', position: 0 },
    { title: 'In Progress', position: 1 },
    { title: 'Completed', position: 2 },
  ];

  return defaultLists.map((listData, index) => ({
    id: `${Date.now()}-${index}`,
    title: listData.title,
    boardId,
    position: listData.position,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const initialState: ListsState = {
  lists: loadListsFromStorage(),
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
  async ({ boardId, userId }: { boardId: string; userId: string }, { rejectWithValue }) => {
    try {
      console.log('Fetching lists for board:', boardId, 'user:', userId);
      
      // First try to load from user-specific storage
      let allLists = loadListsFromUserStorage(userId);
      
      // If no user-specific lists and this is NOT a demo user, ensure clean slate
      if (allLists.length === 0 && userId !== 'demo-user-123') {
        // For personal accounts, don't migrate any lists from global storage
        // to ensure they start with a clean slate
        // Lists will be created as needed when boards are accessed
        allLists = [];
      }
      
      let boardLists = allLists.filter(list => list.boardId === boardId);
      
      // If no lists exist for this board, create default ones
      if (boardLists.length === 0) {
        console.log('No lists found, creating default lists for board:', boardId);
        boardLists = createDefaultLists(boardId);
        
        // Save the new lists to both global and user-specific storage
        const updatedAllLists = [...allLists, ...boardLists];
        saveListsToStorage(updatedAllLists);
        saveListsToUserStorage(updatedAllLists, userId);
        
        console.log('Created and saved default lists:', boardLists);
      }
      
      // Sort lists by position
      boardLists.sort((a, b) => a.position - b.position);
      
      console.log('Returning lists for board:', boardLists);
      return boardLists;
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
      
      // Create new list
      const newList: List = {
        id: Date.now().toString(),
        title: listData.title,
        boardId: listData.boardId,
        position: listData.position,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      const existingLists = loadListsFromStorage();
      const updatedLists = [...existingLists, newList];
      saveListsToStorage(updatedLists);
      
      console.log('List created and saved to localStorage:', newList);
      return newList;
    } catch (error) {
      console.error('Error creating list:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create list');
    }
  }
);

export const moveListAsync = createAsyncThunk(
  'lists/moveListAsync',
  async (data: { listId: string; newPosition: number }, { rejectWithValue, getState }) => {
    try {
      console.log('Moving list:', data);
      
      // Get current state to update positions
      const state = getState() as any;
      const currentLists = [...state.lists.lists];
      
      // Update positions in memory
      const listIndex = currentLists.findIndex(list => list.id === data.listId);
      if (listIndex !== -1) {
        currentLists[listIndex].position = data.newPosition;
        currentLists[listIndex].updatedAt = new Date().toISOString();
        
        // Save to localStorage
        const allLists = loadListsFromStorage();
        const otherLists = allLists.filter(l => !currentLists.find(cl => cl.id === l.id));
        const updatedAllLists = [...otherLists, ...currentLists];
        saveListsToStorage(updatedAllLists);
        
        console.log('List moved and saved to localStorage');
        return data;
      }
      
      throw new Error('List not found');
    } catch (error) {
      console.error('Error moving list:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to move list');
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
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
      saveListsToStorage(state.lists);
    },
    reorderLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
      saveListsToStorage(state.lists);
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
        saveListsToStorage(state.lists);
      })
      .addCase(createListsFromTemplate.fulfilled, (state, action) => {
        state.lists = action.payload.lists;
        saveListsToStorage(state.lists);
      })
      .addCase(moveListAsync.fulfilled, (state, action) => {
        // The list reordering is handled by the action itself
        // Just update the position in the state
        const { listId, newPosition } = action.payload;
        const listIndex = state.lists.findIndex(list => list.id === listId);
        if (listIndex !== -1) {
          state.lists[listIndex].position = newPosition;
          state.lists.sort((a, b) => a.position - b.position);
        }
        saveListsToStorage(state.lists);
      });
  },
});

export const { clearError, setLists, reorderLists } = listsSlice.actions;
export default listsSlice.reducer;
