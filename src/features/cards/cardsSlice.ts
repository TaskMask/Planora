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
      
      // Return mock cards for now
      const mockCards: Card[] = [
        {
          id: '1',
          title: 'Design Landing Page',
          description: 'Create a modern and responsive landing page design',
          listId,
          position: 0,
          labels: [],
          assignees: ['user1'],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          priority: 'high',
          estimatedHours: 8,
          checklist: [
            { id: 'c1', text: 'Research competitor designs', completed: true, createdAt: new Date().toISOString() },
            { id: 'c2', text: 'Create wireframes', completed: false, createdAt: new Date().toISOString() },
            { id: 'c3', text: 'Design mockups', completed: false, createdAt: new Date().toISOString() }
          ],
          attachments: [],
          createdBy: 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Implement User Authentication',
          description: 'Set up secure user authentication and authorization',
          listId,
          position: 1,
          labels: [],
          assignees: ['user2', 'user3'],
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          priority: 'urgent',
          estimatedHours: 12,
          checklist: [
            { id: 'c4', text: 'Set up Firebase Auth', completed: true, createdAt: new Date().toISOString() },
            { id: 'c5', text: 'Create login forms', completed: true, createdAt: new Date().toISOString() },
            { id: 'c6', text: 'Add password reset', completed: false, createdAt: new Date().toISOString() },
            { id: 'c7', text: 'Implement email verification', completed: false, createdAt: new Date().toISOString() }
          ],
          attachments: [],
          createdBy: 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Write Documentation',
          description: 'Document the API endpoints and user guide',
          listId,
          position: 2,
          labels: [],
          assignees: [],
          priority: 'medium',
          estimatedHours: 4,
          attachments: [],
          createdBy: 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate loading
      console.log('Returning mock cards');
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
      const cardIndex = state.cards.findIndex(card => card.id === cardId);
      
      if (cardIndex !== -1) {
        const card = state.cards[cardIndex];
        const oldListId = card.listId;
        
        // Remove card from its current position
        state.cards.splice(cardIndex, 1);
        
        // Get all cards in the target list, sorted by position
        const targetListCards = state.cards
          .filter(c => c.listId === newListId)
          .sort((a, b) => a.position - b.position);
        
        // Update the moved card
        const updatedCard = {
          ...card,
          listId: newListId,
          position: newPosition,
          updatedAt: new Date().toISOString(),
        };
        
        // Reposition cards in target list
        targetListCards.forEach((c, index) => {
          const cardIdx = state.cards.findIndex(sc => sc.id === c.id);
          if (cardIdx !== -1) {
            if (index >= newPosition) {
              state.cards[cardIdx] = {
                ...state.cards[cardIdx],
                position: index + 1,
              };
            } else {
              state.cards[cardIdx] = {
                ...state.cards[cardIdx],
                position: index,
              };
            }
          }
        });
        
        // If moving to a different list, reposition cards in the old list
        if (oldListId !== newListId) {
          const oldListCards = state.cards
            .filter(c => c.listId === oldListId)
            .sort((a, b) => a.position - b.position);
            
          oldListCards.forEach((c, index) => {
            const cardIdx = state.cards.findIndex(sc => sc.id === c.id);
            if (cardIdx !== -1) {
              state.cards[cardIdx] = {
                ...state.cards[cardIdx],
                position: index,
              };
            }
          });
        }
        
        // Add the updated card back
        state.cards.push(updatedCard);
        
        console.log('Card moved:', { cardId, newListId, newPosition, updatedCard });
      }
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
        state.cards = action.payload;
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
