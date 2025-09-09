import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Label } from '../../types';
import { createBoardLabels } from '../../data/defaultLabels';

interface LabelsState {
  labels: Label[];
  loading: boolean;
  error: string | null;
}

const initialState: LabelsState = {
  labels: [],
  loading: false,
  error: null,
};

export const fetchLabels = createAsyncThunk(
  'labels/fetchLabels',
  async (boardId: string, { rejectWithValue }) => {
    try {
      console.log('Fetching labels for board:', boardId);
      
      // Return default labels for the board
      const labels = createBoardLabels(boardId);
      
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate loading
      console.log('Returning board labels:', labels);
      return labels;
    } catch (error) {
      console.error('Error fetching labels:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch labels');
    }
  }
);

export const createLabel = createAsyncThunk(
  'labels/createLabel',
  async (labelData: { name: string; color: string; boardId: string }, { rejectWithValue }) => {
    try {
      console.log('Creating label:', labelData);
      
      const newLabel: Label = {
        id: Date.now().toString(),
        name: labelData.name,
        color: labelData.color,
        boardId: labelData.boardId,
      };
      
      console.log('Label created:', newLabel);
      return newLabel;
    } catch (error) {
      console.error('Error creating label:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create label');
    }
  }
);

export const updateLabel = createAsyncThunk(
  'labels/updateLabel',
  async (labelData: Partial<Label> & { id: string }, { rejectWithValue }) => {
    try {
      console.log('Updating label:', labelData);
      
      // Simulate update
      const updatedLabel = labelData;
      
      console.log('Label updated:', updatedLabel);
      return updatedLabel;
    } catch (error) {
      console.error('Error updating label:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update label');
    }
  }
);

export const deleteLabel = createAsyncThunk(
  'labels/deleteLabel',
  async (labelId: string, { rejectWithValue }) => {
    try {
      console.log('Deleting label:', labelId);
      
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('Label deleted:', labelId);
      return labelId;
    } catch (error) {
      console.error('Error deleting label:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete label');
    }
  }
);

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    clearLabels: (state) => {
      state.labels = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch labels
      .addCase(fetchLabels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabels.fulfilled, (state, action) => {
        state.loading = false;
        state.labels = action.payload;
      })
      .addCase(fetchLabels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create label
      .addCase(createLabel.fulfilled, (state, action) => {
        state.labels.push(action.payload);
      })
      // Update label
      .addCase(updateLabel.fulfilled, (state, action) => {
        const index = state.labels.findIndex(label => label.id === action.payload.id);
        if (index !== -1) {
          state.labels[index] = { ...state.labels[index], ...action.payload };
        }
      })
      // Delete label
      .addCase(deleteLabel.fulfilled, (state, action) => {
        state.labels = state.labels.filter(label => label.id !== action.payload);
      });
  },
});

export const { clearLabels } = labelsSlice.actions;
export default labelsSlice.reducer;
