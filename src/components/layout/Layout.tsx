// Main layout component that includes demo banner and header
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { Header } from './Header';
import { DemoBanner } from '../DemoBanner';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Check if current user is the demo user
  const isDemoMode = user?.id === 'demo-user-123';
  
  // Debug logging
  console.log('Layout: Current user:', user);
  console.log('Layout: isDemoMode:', isDemoMode);

  const handleExitDemo = async () => {
    try {
      await signOut();
      // Navigate to auth page with register mode
      navigate('/auth?mode=register');
    } catch (error) {
      console.error('Error exiting demo:', error);
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #111111 50%, #0a0a0a 75%, #000000 100%)'
      }}
    >
      {isDemoMode && <DemoBanner onExitDemo={handleExitDemo} />}
      <Header />
      <main>{children}</main>
    </div>
  );
};
