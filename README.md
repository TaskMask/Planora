# Planora - Trello - ✅ Board management (create, edit, delete)
- ✅ List management with drag-and-drop
- ✅ Card management with detailed modals
- ✅ Custom labels and priorities
- ✅ Board templates
- ✅ Responsive designlone

A portfolio-ready Kanban board application built with modern web technologies and Firebase backend.

## 🎯 Project Overview

A multi-user Kanban board app with boards, lists/columns, and cards (tasks). Built with open-source tooling and Firebase for authentication, database, and storage.

## ✨ Features

### Core Features (MVP)
- ✅ User authentication (email/password + Google sign-in)
- ✅ Create, rename, delete boards with member management
- ✅ Create, rename, reorder, and delete lists/columns
- ✅ Full card management: create, edit, delete, drag-and-drop
- ✅ Card properties: title, description, labels, assignees, due dates, attachments
- ✅ Responsive UI for desktop and mobile

### Intermediate Features
- 🔄 Real-time collaboration with instant updates
- 💬 Card comments and activity feed
- 🔍 Search and filter functionality
- 📎 File attachments with Firebase Storage

### Advanced Features
- 👥 Team roles and permissions (owner, admin, member, viewer)
- � Mobile responsive design
- 🎨 Custom board backgrounds and themes
- �📅 Calendar view integration
- 🔍 Advanced search and filtering
- � Analytics and reporting
- ↩️ Undo/history functionality
- 🤖 AI assistant for task suggestions

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Drag & Drop**: @dnd-kit/core
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **Testing**: Vitest, React Testing Library
- **Deployment**: Firebase Hosting + GitHub Actions

## 📋 Project Timeline

- **Week 0**: Planning & design
- **Week 1-2**: Core frontend scaffolding & auth
- **Week 3-4**: Lists & cards CRUD + drag-and-drop
- **Week 5**: File attachments & advanced features
- **Week 6**: Polishing & accessibility
- **Week 7**: Testing, CI, and deployment
- **Week 8**: Portfolio preparation

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/TaskMask/Planora.git
cd Planora

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Firebase configuration

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
├── features/            # Feature-based modules
├── hooks/               # Custom React hooks
├── services/            # API and Firebase services
├── store/               # Redux store configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles/              # Global styles
```

## 🔧 Development

```bash
# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## 🚢 Deployment

The project is automatically deployed to Firebase Hosting via GitHub Actions on pushes to the main branch.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
