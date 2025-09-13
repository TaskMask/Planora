# Planora Demo Mode - Complete Connection Guide

## 🚀 Demo Routes & Navigation

### Available Demo Routes
- **Main Demo Page**: `http://localhost:5174/demo`
- **Demo Analytics**: `http://localhost:5174/demo/analytics`
- **Demo Board Details**: `http://localhost:5174/demo/boards/:boardId`

### Sample Board IDs
- **Portfolio Website**: `sample-board-1`
- **Mobile App Design**: `sample-board-2`
- **E-commerce Platform**: `sample-board-3`

## 🔗 Connected Demo Flow

### 1. Demo Entry Point (`/demo`)
- **File**: `src/pages/DemoPage.tsx`
- **Functionality**: 
  - Initializes demo user (ID: `demo-user-123`)
  - Loads comprehensive sample data with 3 professional projects
  - Renders `BoardsPage` component with demo data
- **Navigation**: 
  - Click any board → Goes to `/demo/boards/:boardId`
  - Click Analytics → Goes to `/demo/analytics`

### 2. Demo Board Details (`/demo/boards/:boardId`)
- **File**: `src/pages/DemoBoardDetailPage.tsx`
- **Functionality**:
  - Full board management (add/edit/delete lists and cards)
  - Complete CRUD operations like personal account
  - Professional sample data for portfolio demonstration
- **Navigation**:
  - Back to Boards → Goes to `/demo`
  - All board interactions work fully

### 3. Demo Analytics (`/demo/analytics`)
- **File**: `src/pages/DemoAnalyticsPage.tsx`
- **Functionality**:
  - Comprehensive analytics dashboard
  - Portfolio-ready metrics and charts
  - Board performance insights
- **Navigation**:
  - Back to Boards → Goes to `/demo`
  - Click specific board → Goes to `/demo/boards/:boardId`

## 🧠 Smart Navigation System

### Demo Mode Detection
All main pages detect demo mode using:
```typescript
const isDemoMode = user?.id === 'demo-user-123';
```

### BoardsPage Navigation Logic
```typescript
const handleBoardClick = (boardId: string) => {
  if (user?.id === 'demo-user-123') {
    navigate(`/demo/boards/${boardId}`);
  } else {
    navigate(`/boards/${boardId}`);
  }
};

// Analytics button
onClick={() => navigate(user?.id === 'demo-user-123' ? '/demo/analytics' : '/analytics')}
```

### BoardDetailPage Navigation
```typescript
const isDemoMode = user?.id === 'demo-user-123';
const boardsUrl = isDemoMode ? '/demo' : '/boards';

// Back button uses boardsUrl for proper navigation
```

### AnalyticsPage Navigation
```typescript
const isDemoMode = user?.id === 'demo-user-123';
const boardsUrl = isDemoMode ? '/demo' : '/boards';

// Board links
onClick={() => navigate(isDemoMode ? `/demo/boards/${board.boardId}` : `/boards/${board.boardId}`)}
```

## 📊 Sample Data Structure

### Professional Portfolio Projects

1. **Portfolio Website** (`sample-board-1`)
   - Lists: Backlog, Design, Development, Testing, Launch
   - Cards: Professional development tasks with realistic content

2. **Mobile App Design** (`sample-board-2`)
   - Lists: Research, Wireframes, Design, Development, QA
   - Cards: App development workflow with detailed tasks

3. **E-commerce Platform** (`sample-board-3`)
   - Lists: Planning, Backend, Frontend, Integration, Deployment
   - Cards: Full-stack development process

### Data Features
- Professional task descriptions
- Realistic due dates and priorities
- Color-coded labels for different task types
- Comprehensive card details for portfolio showcase

## 🎯 Demo User Experience

### Complete Portfolio Showcase
1. **Landing**: Visit `/demo` to see all projects
2. **Board Exploration**: Click any board to see detailed project management
3. **Analytics Overview**: View comprehensive project analytics
4. **Seamless Navigation**: All connections work smoothly between components

### Professional Features Working
- ✅ Board creation, editing, deletion
- ✅ List management (add, edit, delete, reorder)
- ✅ Card management (add, edit, delete, move between lists)
- ✅ Analytics with real data visualization
- ✅ Smart navigation throughout demo mode
- ✅ Professional styling with dark theme

## 🔧 Technical Implementation

### App.tsx Routing Structure
```typescript
<Routes>
  {/* Public demo routes */}
  <Route path="/demo" element={<DemoPage />} />
  <Route path="/demo/analytics" element={<DemoAnalyticsPage />} />
  <Route path="/demo/boards/:boardId" element={<DemoBoardDetailPage />} />
  {/* Regular authenticated routes */}
  <Route path="*" element={<AppContent />} />
</Routes>
```

### Demo Initialization Pattern
Each demo page follows the same pattern:
1. Clear existing localStorage
2. Login demo user
3. Load sample data via `resetSampleData()`
4. Render corresponding main component

### State Management
- Redux store handles all demo data consistently
- Demo user authentication persists across demo routes
- Sample data integrates seamlessly with existing state slices

## 🎨 User Interface
- **Dark Theme**: Professional black/gray aesthetic throughout
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Framer Motion animations enhance user experience
- **Consistent Navigation**: All demo routes maintain UI consistency

## ✅ Verification Steps

### Test Demo Flow
1. Go to `http://localhost:5174/demo`
2. Verify 3 sample boards load
3. Click Analytics → Verify analytics page loads with data
4. Go back to boards → Click individual board
5. Verify full board detail functionality
6. Test adding/editing cards and lists
7. Navigate back to main demo page
8. Confirm all navigation works seamlessly

### Current Status: ✅ FULLY FUNCTIONAL
All demo components are connected and working as a complete portfolio demonstration system.
