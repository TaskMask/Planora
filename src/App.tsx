import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { BoardsPage } from './pages/BoardsPage';
import { BoardDetailPage } from './pages/BoardDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { DemoPage } from './pages/DemoPage';
import { DemoAnalyticsPage } from './pages/DemoAnalyticsPage';
import { DemoBoardDetailPage } from './pages/DemoBoardDetailPage';
import './App.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  // Debug logging
  console.log('AppContent: user:', user);
  console.log('AppContent: loading:', loading);
  console.log('AppContent: current pathname:', window.location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-violet-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace />} />
      <Route path="/boards" element={<BoardsPage />} />
      <Route path="/boards/:boardId" element={<BoardDetailPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public demo route */}
          <Route path="/demo" element={<DemoPage />} />
          {/* Demo analytics route */}
          <Route path="/demo/analytics" element={<DemoAnalyticsPage />} />
          {/* Demo board detail routes */}
          <Route path="/demo/boards/:boardId" element={<DemoBoardDetailPage />} />
          {/* Auth route */}
          <Route path="/auth" element={<AuthPage />} />
          {/* All other routes */}
          <Route path="*" element={<AppContent />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0a0a0a',
              color: '#e5e7eb',
              border: '1px solid #374151',
            },
            success: {
              duration: 3000,
              style: {
                background: '#0a0a0a',
                color: '#10b981',
                border: '1px solid #10b981',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#0a0a0a',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#0a0a0a',
                color: '#ef4444',
                border: '1px solid #ef4444',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#0a0a0a',
              },
            },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;
