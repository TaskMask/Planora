import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Board, BoardsState } from '../../types';

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Return empty array for initial load - boards will be added via createBoard
      // In a real app, this would fetch from an API
      return [];
    } catch (error) {
      console.error('Error fetching boards:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch boards');
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData: { 
    title: string; 
    description: string; 
    ownerId: string;
    template?: any; // BoardTemplate from boardTemplates
    isPublic?: boolean;
    style?: {
      backgroundColor: string;
      cardStyle: string;
    };
  }, { rejectWithValue }) => {
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
        isPublic: boardData.isPublic || false,
        backgroundColor: boardData.style?.backgroundColor || boardData.template?.backgroundColor || '#3B82F6',
        permissions: [],
        allowComments: true,
        allowVoting: true,
        isArchived: false,
        tags: [],
        style: {
          backgroundColor: boardData.style?.backgroundColor || boardData.template?.backgroundColor || '#3B82F6',
          cardStyle: (boardData.style?.cardStyle as any) || 'default',
          fontSize: 'medium',
          spacing: 'normal'
        },
      };
      
      console.log('Board created:', newBoard);
      return { board: newBoard, template: boardData.template };
    } catch (error) {
      console.error('Error creating board:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create board');
    }
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async (boardData: { id: string; title: string; description: string; isPublic?: boolean; backgroundColor?: string }, { rejectWithValue }) => {
    try {
      console.log('Updating board:', boardData);
      
      // Simulate update with mock data
      const updatedBoard = {
        ...boardData,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Board updated:', updatedBoard);
      return updatedBoard;
    } catch (error) {
      console.error('Error updating board:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update board');
    }
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId: string, { rejectWithValue }) => {
    try {
      console.log('Deleting board:', boardId);
      
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Board deleted:', boardId);
      return boardId;
    } catch (error) {
      console.error('Error deleting board:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete board');
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
        state.boards.unshift(action.payload.board);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update board
      .addCase(updateBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.boards.findIndex(board => board.id === action.payload.id);
        if (index !== -1) {
          state.boards[index] = { ...state.boards[index], ...action.payload };
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete board
      .addCase(deleteBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = state.boards.filter(board => board.id !== action.payload);
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBoards, setCurrentBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
