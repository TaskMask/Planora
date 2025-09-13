import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { BoardDetailPage } from './BoardDetailPage';
import { resetSampleData } from '../utils/seedData';
import { loginDemo } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth';

export const DemoBoardDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeDemoBoardDetail = async () => {
      try {
        console.log('🎯 Initializing demo board detail page...');
        
        // Check if demo user is already logged in
        if (user?.id === 'demo-user-123') {
          console.log('✅ Demo user already logged in for board detail');
          setIsInitializing(false);
          return;
        }
        
        // Clear existing data
        localStorage.removeItem('planora_boards');
        localStorage.removeItem('planora_lists');
        localStorage.removeItem('planora_cards');
        
        // Login demo user
        const demoUser = await dispatch(loginDemo()).unwrap();
        console.log('✅ Demo user logged in for board detail:', demoUser);
        
        // Load sample data
        resetSampleData(demoUser.id, dispatch);
        console.log('✅ Sample data loaded for board detail');
        
        setIsInitializing(false);
      } catch (error) {
        console.error('❌ Demo board detail initialization failed:', error);
        setIsInitializing(false);
      }
    };

    initializeDemoBoardDetail();
  }, [dispatch, user]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-violet-300">Initializing demo board...</p>
        </div>
      </div>
    );
  }

  return <BoardDetailPage />;
};
