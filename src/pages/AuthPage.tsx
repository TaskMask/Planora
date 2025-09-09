import React, { useState } from 'react';
import { LoginForm, RegisterForm } from '../components/auth';
import { useAuth } from '../hooks/useAuth';

type AuthMode = 'login' | 'register';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { signIn, signUp, signInWithGoogle, loading, error } = useAuth();

  const handleLogin = async (data: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      await signIn(data.email, data.password, data.rememberMe);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleRegister = async (data: { email: string; password: string; displayName: string }) => {
    try {
      await signUp(data.email, data.password, data.displayName);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Planora
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Your collaborative Kanban board
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Auth Forms */}
        {mode === 'login' ? (
          <LoginForm
            onSubmit={handleLogin}
            onSwitchToRegister={() => setMode('register')}
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={loading}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            onSwitchToLogin={() => setMode('login')}
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};
