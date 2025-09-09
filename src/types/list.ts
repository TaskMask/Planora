export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListsState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

export interface CreateListData {
  title: string;
  boardId: string;
  position: number;
}

export interface UpdateListData {
  id: string;
  title?: string;
  position?: number;
}
