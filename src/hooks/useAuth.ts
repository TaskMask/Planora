import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setUser, loginWithEmail, registerWithEmail, loginWithGoogle, logout } from '../features/auth';
import { authService } from '../services/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      dispatch(setUser(user));
    });

    return unsubscribe;
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

  const signOut = async () => {
    return dispatch(logout()).unwrap();
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };
};
