# Planora Development Plan

## Project Overview

Planora is a Trello clone built as a portfolio project featuring modern web technologies and Firebase backend. This document outlines the step-by-step implementation plan.

## Current Progress

### ✅ Completed (Week 0 - Planning & Setup)
- [x] Project repository setup and GitHub linking
- [x] React + TypeScript + Vite configuration
- [x] Tailwind CSS setup
- [x] Redux Toolkit with RTK Query setup
- [x] Firebase configuration structure
- [x] Project folder structure
- [x] TypeScript type definitions
- [x] Initial Redux slices (Auth, Boards, Lists, Cards)
- [x] Development environment configuration

### 🔄 In Progress (Week 1 - Core Frontend & Auth)
- [ ] Firebase project setup and configuration
- [ ] Authentication components (Login, Register, Profile)
- [ ] Protected route implementation
- [ ] Basic UI components library
- [ ] App shell and navigation

### 📋 TODO (Weeks 2-8)

#### Week 1-2: Core Frontend Scaffolding & Auth
- [ ] Set up Firebase project and configure environment variables
- [ ] Implement authentication flow
  - [ ] Login/Register forms with validation
  - [ ] Google Sign-in integration
  - [ ] Password reset functionality
  - [ ] Protected routes and auth guards
- [ ] Create basic UI component library
  - [ ] Button, Input, Modal, Card components
  - [ ] Loading states and error handling
- [ ] Implement app shell
  - [ ] Header with user menu
  - [ ] Sidebar navigation
  - [ ] Responsive layout

#### Week 3-4: Lists & Cards CRUD + Drag-and-Drop
- [ ] Board management
  - [ ] Board list view
  - [ ] Create/edit/delete boards
  - [ ] Board member management
- [ ] List management
  - [ ] Create/edit/delete lists
  - [ ] List reordering
- [ ] Card management
  - [ ] Create/edit/delete cards
  - [ ] Card details modal
  - [ ] Card properties (labels, assignees, due dates)
- [ ] Drag-and-drop implementation
  - [ ] Card drag between lists
  - [ ] List reordering
  - [ ] Optimistic updates

#### Week 5: Real-time Sync & Attachments
- [ ] Firestore real-time listeners
- [ ] Real-time collaboration features
- [ ] File attachment system
  - [ ] Firebase Storage integration
  - [ ] File upload UI
  - [ ] File type validation
- [ ] Comments system
- [ ] Activity feed

#### Week 6: Polishing & Advanced Features
- [ ] Search and filter functionality
- [ ] Accessibility improvements
- [ ] Mobile responsiveness
- [ ] Team roles and permissions
- [ ] Notifications system
- [ ] Calendar view (optional)

#### Week 7: Testing, CI, and Deployment
- [ ] Unit tests for Redux slices
- [ ] Component testing with React Testing Library
- [ ] E2E testing setup
- [ ] Firestore security rules
- [ ] GitHub Actions CI/CD
- [ ] Firebase Hosting deployment

#### Week 8: Portfolio Preparation
- [ ] README documentation
- [ ] Demo video recording
- [ ] Case study write-up
- [ ] Performance optimization
- [ ] Final polish and bug fixes

## Technical Decisions

### Architecture
- **Frontend**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: Redux Toolkit for predictable state management
- **Backend**: Firebase for authentication, database, and storage
- **Drag & Drop**: @dnd-kit for accessible drag-and-drop functionality

### Data Model
```
users/{userId}
  - email, displayName, photoURL, createdAt, updatedAt

boards/{boardId}
  - title, description, ownerId, members[], createdAt, updatedAt
  - subcollections: lists, activities

boards/{boardId}/lists/{listId}
  - title, position, createdAt, updatedAt
  
boards/{boardId}/lists/{listId}/cards/{cardId}
  - title, description, position, labels[], assignees[], dueDate
  - createdBy, createdAt, updatedAt
  - subcollections: comments, attachments
```

### Security
- Firestore security rules based on board membership
- User can only access boards they are members of
- File uploads restricted by size and type
- Client-side and server-side validation

## Next Steps

1. Set up Firebase project and configure environment variables
2. Implement basic authentication flow
3. Create reusable UI components
4. Build board and list management features
5. Add drag-and-drop functionality

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React DnD Kit](https://dndkit.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
