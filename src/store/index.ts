import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth';
import boardsReducer from '../features/boards';
import listsReducer from '../features/lists';
import cardsReducer from '../features/cards';
import labelsReducer from '../features/labels';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    lists: listsReducer,
    cards: cardsReducer,
    labels: labelsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
