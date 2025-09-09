import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Board, BoardsState } from '../../types';

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

// Mock boards for development without Firestore
const mockBoards: Board[] = [
  {
    id: '1',
    title: 'My First Board',
    description: 'A sample board to get you started',
    ownerId: 'demo-user',
    members: ['demo-user'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    backgroundColor: '#3B82F6',
  },
  {
    id: '2',
    title: 'Team Project',
    description: 'Collaborative workspace for the team',
    ownerId: 'demo-user',
    members: ['demo-user'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: true,
    backgroundColor: '#10B981',
  },
];

export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('Fetching boards for user:', userId);
      // Return mock boards for now
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      console.log('Returning mock boards');
      return mockBoards;
    } catch (error) {
      console.error('Error fetching boards:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch boards');
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData: { title: string; description: string; ownerId: string }, { rejectWithValue }) => {
    try {
      console.log('Creating board:', boardData);
      
      // Create a new board with mock data
      const newBoard: Board = {
        id: Date.now().toString(),
        title: boardData.title,
        description: boardData.description,
        ownerId: boardData.ownerId,
        members: [boardData.ownerId],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
      };
      
      console.log('Board created:', newBoard);
      return newBoard;
    } catch (error) {
      console.error('Error creating board:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create board');
    }
  }
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    clearBoards: (state) => {
      state.boards = [];
      state.currentBoard = null;
    },
    setCurrentBoard: (state, action: PayloadAction<Board | null>) => {
      state.currentBoard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch boards
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create board
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards.unshift(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBoards, setCurrentBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
