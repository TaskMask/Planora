export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  boardId: string;
  position: number;
  assignedTo?: string[];
  labels?: string[];
  dueDate?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface CardsState {
  cards: Card[];
  loading: boolean;
  error: string | null;
}

export interface CreateCardData {
  title: string;
  description?: string;
  listId: string;
  boardId: string;
  position: number;
}

export interface UpdateCardData {
  id: string;
  title?: string;
  description?: string;
  listId?: string;
  position?: number;
  assignedTo?: string[];
  labels?: string[];
  dueDate?: Date;
}
