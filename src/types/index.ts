export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BoardPermission {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  addedAt: string;
  addedBy: string;
}

export interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'project' | 'kanban' | 'scrum' | 'personal' | 'business';
  lists: {
    title: string;
    cards?: {
      title: string;
      description?: string;
    }[];
  }[];
  backgroundColor: string;
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
}

export interface BoardStyle {
  backgroundColor: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  cardStyle: 'default' | 'minimal' | 'colorful' | 'glass';
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
}

export interface Board {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  members: string[];
  permissions: BoardPermission[];
  templateId?: string;
  style: BoardStyle;
  isPublic: boolean;
  allowComments: boolean;
  allowVoting: boolean;
  isArchived: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  // Legacy support
  backgroundColor?: string;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
  position: number;
  labels: Label[];
  assignees: string[];
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours?: number;
  timeSpent?: number;
  checklist?: ChecklistItem[];
  coverImage?: string;
  isArchived?: boolean;
  attachments: Attachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  boardId?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  cardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  type: 'card_created' | 'card_moved' | 'card_updated' | 'comment_added' | 'member_added';
  description: string;
  userId: string;
  boardId: string;
  cardId?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Redux state types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

export interface ListsState {
  lists: List[];
  loading: boolean;
  error: string | null;
}

export interface CardsState {
  cards: Card[];
  loading: boolean;
  error: string | null;
}

export interface LabelsState {
  labels: Label[];
  loading: boolean;
  error: string | null;
}
