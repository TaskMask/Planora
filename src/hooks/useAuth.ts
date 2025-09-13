import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setUser, loginWithEmail, registerWithEmail, loginWithGoogle, loginDemo, logout } from '../features/auth';
import { authService } from '../services/auth';
import { demoAuthService } from '../services/demoAuth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Listen to both Firebase auth and demo auth state changes
    const unsubscribeFirebase = authService.onAuthStateChanged((user) => {
      if (user && user.id !== 'demo-user-123') {
        // Clear demo data when a real user logs in
        demoAuthService.clearDemoData();
      }
      dispatch(setUser(user));
    });

    const unsubscribeDemo = demoAuthService.onAuthStateChanged((user) => {
      if (user && user.id === 'demo-user-123') {
        dispatch(setUser(user));
      }
    });

    return () => {
      unsubscribeFirebase();
      unsubscribeDemo();
    };
  }, [dispatch]);

  const signIn = async (email: string, password: string, rememberMe?: boolean) => {
    return dispatch(loginWithEmail({ email, password, rememberMe })).unwrap();
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    return dispatch(registerWithEmail({ email, password, displayName })).unwrap();
  };

  const signInWithGoogle = async () => {
    return dispatch(loginWithGoogle()).unwrap();
  };

  const signInDemo = async () => {
    return dispatch(loginDemo()).unwrap();
  };

  const signOut = async () => {
    // Clear demo data on logout
    if (user?.id === 'demo-user-123') {
      // Clear only demo-specific localStorage data
      localStorage.removeItem('planora_demo_user');
      localStorage.removeItem('planora_boards_demo-user-123');
      localStorage.removeItem('planora_lists_demo-user-123');
      localStorage.removeItem('planora_cards_demo-user-123');
    }
    demoAuthService.clearDemoData();
    return dispatch(logout()).unwrap();
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInDemo,
    signOut,
    isAuthenticated: !!user,
  };
};
