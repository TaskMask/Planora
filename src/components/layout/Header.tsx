import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User, Settings, ChevronDown, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if user is in demo mode
  const isDemoMode = user?.id === 'demo-user-123';
  const boardsUrl = isDemoMode ? '/demo' : '/boards';
  const analyticsUrl = isDemoMode ? '/demo/analytics' : '/analytics';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to auth page after sign out
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50 rounded-b-3xl shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold text-white cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(boardsUrl)}
          >
            Planora
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => navigate(boardsUrl)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Boards
          </button>
          <button
            onClick={() => navigate(analyticsUrl)}
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </button>
        </div>          {/* User Menu */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors p-2 rounded-2xl hover:bg-gray-800"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || user.email}
                    className="w-8 h-8 rounded-full border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                    {(user.displayName || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium hidden sm:block">
                  {user.displayName || user.email}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-xl shadow-black/20 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-gray-300">{user.displayName || user.email}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        navigate(analyticsUrl);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors flex items-center space-x-2 rounded-2xl mx-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors flex items-center space-x-2 rounded-2xl mx-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        navigate('/settings');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors flex items-center space-x-2 rounded-2xl mx-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors flex items-center space-x-2 rounded-2xl mx-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};