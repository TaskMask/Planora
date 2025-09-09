import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Card, CardsState } from '../../types';

const initialState: CardsState = {
  cards: [],
  loading: false,
  error: null,
};

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (listId: string) => {
    // TODO: Implement Firebase Firestore query
    console.log('Fetching cards for list:', listId);
    return [] as Card[];
  }
);

export const createCard = createAsyncThunk(
  'cards/createCard',
  async (cardData: Partial<Card>) => {
    // TODO: Implement Firebase Firestore create
    console.log('Creating card:', cardData);
    return {} as Card;
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    moveCard: (state, action: PayloadAction<{ cardId: string; newListId: string; newPosition: number }>) => {
      const { cardId, newListId, newPosition } = action.payload;
      const cardIndex = state.cards.findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        state.cards[cardIndex].listId = newListId;
        state.cards[cardIndex].position = newPosition;
      }
    },
    reorderCards: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cards';
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
      });
  },
});

export const { clearError, moveCard, reorderCards } = cardsSlice.actions;
export default cardsSlice.reducer;
