import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Card, CardsState } from '../../types';

const initialState: CardsState = {
  cards: [],
  loading: false,
  error: null,
};

export const updateCard = createAsyncThunk(
  'cards/updateCard',
  async (cardData: Partial<Card> & { id: string }, { rejectWithValue }) => {
    try {
      console.log('Updating card:', cardData);
      
      // Simulate update with mock data
      const updatedCard = {
        ...cardData,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Card updated:', updatedCard);
      return updatedCard;
    } catch (error) {
      console.error('Error updating card:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update card');
    }
  }
);

export const deleteCard = createAsyncThunk(
  'cards/deleteCard',
  async (cardId: string, { rejectWithValue }) => {
    try {
      console.log('Deleting card:', cardId);
      
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Card deleted:', cardId);
      return cardId;
    } catch (error) {
      console.error('Error deleting card:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete card');
    }
  }
);

export const createCardsFromTemplate = createAsyncThunk(
  'cards/createCardsFromTemplate',
  async (data: { templateLists: any[]; listMapping: Record<string, string>; userId: string }, { rejectWithValue }) => {
    try {
      console.log('Creating cards from template:', data);
      
      const cards: Card[] = [];
      
      data.templateLists.forEach((templateList, listIndex) => {
        const actualListId = data.listMapping[listIndex.toString()];
        if (templateList.cards && actualListId) {
          templateList.cards.forEach((templateCard: any, cardIndex: number) => {
            cards.push({
              id: `${Date.now()}-${listIndex}-${cardIndex}`,
              title: templateCard.title,
              description: templateCard.description || '',
              listId: actualListId,
              position: cardIndex,
              labels: [],
              assignees: [],
              attachments: [],
              createdBy: data.userId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          });
        }
      });
      
      console.log('Created cards from template:', cards);
      return cards;
    } catch (error) {
      console.error('Error creating cards from template:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create cards');
    }
  }
);

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (listId: string, { rejectWithValue }) => {
    try {
      console.log('Fetching cards for list:', listId);
      
      // Return empty cards array for new boards
      const mockCards: Card[] = [];
      
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate loading
      console.log('Returning empty cards for list:', listId);
      return mockCards;
    } catch (error) {
      console.error('Error fetching cards:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch cards');
    }
  }
);

export const createCard = createAsyncThunk(
  'cards/createCard',
  async (cardData: { 
    title: string; 
    description?: string; 
    listId: string; 
    boardId: string;
    position: number; 
    createdBy: string;
  }, { rejectWithValue }) => {
    try {
      console.log('Creating card:', cardData);
      
      // Create mock card
      const newCard: Card = {
        id: Date.now().toString(),
        title: cardData.title,
        description: cardData.description || '',
        listId: cardData.listId,
        position: cardData.position,
        labels: [],
        assignees: [],
        attachments: [],
        createdBy: cardData.createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Card created:', newCard);
      return newCard;
    } catch (error) {
      console.error('Error creating card:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create card');
    }
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    reorderCards: (state, action: PayloadAction<{ cards: Card[] }>) => {
      state.cards = action.payload.cards;
    },
    moveCard: (state, action: PayloadAction<{ cardId: string; newListId: string; newPosition: number }>) => {
      const { cardId, newListId, newPosition } = action.payload;
      console.log('moveCard action called:', { cardId, newListId, newPosition });
      
      const cardIndex = state.cards.findIndex(card => card.id === cardId);
      
      if (cardIndex === -1) {
        console.error('Card not found with id:', cardId);
        return;
      }
      
      const card = state.cards[cardIndex];
      const oldListId = card.listId;
      
      console.log('Moving card:', card.title, 'from list:', oldListId, 'to list:', newListId, 'at position:', newPosition);
      
      // Step 1: Update the card being moved
      state.cards[cardIndex] = {
        ...card,
        listId: newListId,
        position: newPosition,
        updatedAt: new Date().toISOString(),
      };
      
      // Step 2: Update positions of other cards in the target list
      state.cards.forEach((c, index) => {
        if (c.id !== cardId && c.listId === newListId) {
          if (c.position >= newPosition) {
            state.cards[index] = {
              ...c,
              position: c.position + 1,
            };
          }
        }
      });
      
      // Step 3: If moving between lists, update positions in the old list
      if (oldListId !== newListId) {
        state.cards.forEach((c, index) => {
          if (c.listId === oldListId && c.position > card.position) {
            state.cards[index] = {
              ...c,
              position: c.position - 1,
            };
          }
        });
      }
      
      // Step 4: Clean up and normalize positions
      [oldListId, newListId].forEach(listId => {
        if (listId) {
          const listCards = state.cards
            .filter(c => c.listId === listId)
            .sort((a, b) => a.position - b.position);
          
          listCards.forEach((c, index) => {
            const cardIdx = state.cards.findIndex(sc => sc.id === c.id);
            if (cardIdx !== -1 && state.cards[cardIdx].position !== index) {
              state.cards[cardIdx] = {
                ...state.cards[cardIdx],
                position: index,
              };
            }
          });
        }
      });
      
      console.log('Card move completed');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cards
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        // Don't replace all cards, add/update only the cards for this specific list
        const newCards = action.payload;
        const listId = newCards.length > 0 ? newCards[0].listId : null;
        
        if (listId) {
          // Remove existing cards for this list to avoid duplicates
          state.cards = state.cards.filter(card => card.listId !== listId);
          // Add the new cards for this list
          state.cards.push(...newCards);
          console.log('Cards updated for list:', listId, 'Total cards now:', state.cards.length);
        }
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cards';
      })
      // Create card
      .addCase(createCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
      })
      // Update card
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(card => card.id === action.payload.id);
        if (index !== -1) {
          state.cards[index] = { ...state.cards[index], ...action.payload };
        }
      })
      // Delete card
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter(card => card.id !== action.payload);
      })
      // Create cards from template
      .addCase(createCardsFromTemplate.fulfilled, (state, action) => {
        state.cards.push(...action.payload);
      });
  },
});

export const { clearError, moveCard, reorderCards } = cardsSlice.actions;
export default cardsSlice.reducer;
