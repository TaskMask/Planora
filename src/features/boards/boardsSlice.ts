import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Board, BoardsState } from '../../types';

// Helper functions for localStorage
const BOARDS_STORAGE_KEY = 'planora_boards';

const saveBoardsToStorage = (boards: Board[]) => {
  try {
    localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards));
  } catch (error) {
    console.error('Failed to save boards to localStorage:', error);
  }
};

const loadBoardsFromStorage = (): Board[] => {
  try {
    const stored = localStorage.getItem(BOARDS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load boards from localStorage:', error);
    return [];
  }
};

const getUserSpecificStorageKey = (userId: string) => `planora_boards_${userId}`;

const saveBoardsToUserStorage = (boards: Board[], userId: string) => {
  try {
    localStorage.setItem(getUserSpecificStorageKey(userId), JSON.stringify(boards));
  } catch (error) {
    console.error('Failed to save boards to localStorage:', error);
  }
};

const loadBoardsFromUserStorage = (userId: string): Board[] => {
  try {
    const stored = localStorage.getItem(getUserSpecificStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load boards from localStorage:', error);
    return [];
  }
};

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
      // First try to load from user-specific storage
      let userBoards = loadBoardsFromUserStorage(userId);
      
      // If no user-specific boards and this is NOT a demo user, try to migrate from global storage
      if (userBoards.length === 0 && userId !== 'demo-user-123') {
        const storedBoards = loadBoardsFromStorage();
        // Only migrate boards that belong to this specific user (not demo data)
        userBoards = storedBoards.filter(board => 
          board.ownerId === userId && board.ownerId !== 'demo-user-123'
        );
        
        // Save to user-specific storage if we found any boards
        if (userBoards.length > 0) {
          saveBoardsToUserStorage(userBoards, userId);
        }
      }
      
      console.log('Loaded boards for user', userId, ':', userBoards);
      return userBoards;
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
      
      // Save to both global and user-specific localStorage
      const existingBoards = loadBoardsFromStorage();
      const updatedBoards = [newBoard, ...existingBoards];
      saveBoardsToStorage(updatedBoards);
      
      // Also save to user-specific storage
      const userBoards = loadBoardsFromUserStorage(boardData.ownerId);
      const updatedUserBoards = [newBoard, ...userBoards];
      saveBoardsToUserStorage(updatedUserBoards, boardData.ownerId);
      
      console.log('Board created and saved to localStorage:', newBoard);
      return { board: newBoard, template: boardData.template };
    } catch (error) {
      console.error('Error creating board:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create board');
    }
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async (boardData: { id: string; title: string; description: string; isPublic?: boolean; backgroundColor?: string; style?: any; allowComments?: boolean; allowVoting?: boolean }, { rejectWithValue }) => {
    try {
      console.log('Updating board:', boardData);
      
      // Load existing boards from localStorage
      const existingBoards = loadBoardsFromStorage();
      const boardIndex = existingBoards.findIndex(board => board.id === boardData.id);
      
      if (boardIndex === -1) {
        throw new Error('Board not found');
      }
      
      const originalBoard = existingBoards[boardIndex];
      const userId = originalBoard.ownerId;
      
      // Update the board with new data
      const updatedBoard = {
        ...originalBoard,
        ...boardData,
        updatedAt: new Date().toISOString(),
      };
      
      // Update in global storage
      existingBoards[boardIndex] = updatedBoard;
      saveBoardsToStorage(existingBoards);
      
      // Update in user-specific storage
      const userBoards = loadBoardsFromUserStorage(userId);
      const userBoardIndex = userBoards.findIndex(board => board.id === boardData.id);
      if (userBoardIndex !== -1) {
        userBoards[userBoardIndex] = updatedBoard;
        saveBoardsToUserStorage(userBoards, userId);
      }
      
      console.log('Board updated and saved to localStorage:', updatedBoard);
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
      
      // Load existing boards to find the userId before deleting
      const existingBoards = loadBoardsFromStorage();
      const boardToDelete = existingBoards.find(board => board.id === boardId);
      
      if (!boardToDelete) {
        throw new Error('Board not found');
      }
      
      const userId = boardToDelete.ownerId;
      
      // Update global storage
      const updatedBoards = existingBoards.filter(board => board.id !== boardId);
      saveBoardsToStorage(updatedBoards);
      
      // Update user-specific storage
      const userBoards = loadBoardsFromUserStorage(userId);
      const updatedUserBoards = userBoards.filter(board => board.id !== boardId);
      saveBoardsToUserStorage(updatedUserBoards, userId);
      
      console.log('Board deleted from localStorage:', boardId);
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
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
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

export const { clearBoards, setBoards, setCurrentBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
