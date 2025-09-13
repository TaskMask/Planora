import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { AppDispatch } from '../store';
import { loginDemo, loginWithEmail, registerWithEmail, loginWithGoogle } from '../features/auth/authSlice';
import { resetSampleData } from '../utils/seedData';
import { LoadingSpinner, LoadingOverlay } from '../components/ui/LoadingSpinner';
import { FadeInUp, ScaleIn } from '../components/ui/Animations';
import toast from 'react-hot-toast';

const FloatingOrb: React.FC<{ className?: string; delay?: number }> = ({ className = '', delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  />
);

export const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [authMode, setAuthMode] = useState<'choose' | 'login' | 'register'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // Check URL parameters to set initial auth mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setAuthMode('register');
    } else if (mode === 'login') {
      setAuthMode('login');
    }
  }, [searchParams]);

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage('Loading demo experience...');
      console.log('🎯 Starting demo login process...');
      
      // Clear existing demo data using user-specific keys
      console.log('🧹 Clearing existing demo data...');
      localStorage.removeItem('planora_demo_user');
      localStorage.removeItem('planora_boards_demo-user-123');
      localStorage.removeItem('planora_lists_demo-user-123');
      localStorage.removeItem('planora_cards_demo-user-123');
      
      // Dispatch demo login action (this will handle sign in via authSlice)
      console.log('🔑 Dispatching demo login action...');
      const demoUser = await dispatch(loginDemo()).unwrap();
      console.log('✅ Demo user signed in:', demoUser);
      
      // Load fresh sample data using user-specific storage
      console.log('📊 Loading fresh sample data...');
      resetSampleData(demoUser.id, dispatch);
      console.log('✅ Fresh sample data loaded to localStorage and Redux');
      
      console.log('✅ Demo login complete!');
      toast.success('Welcome to the demo! Explore the portfolio-ready features.');
      
      // Navigate directly to dedicated demo page
      console.log('🚀 Navigating to /demo');
      window.location.href = '/demo';
      
    } catch (error) {
      console.error('❌ Demo login failed:', error);
      toast.error(`Failed to load demo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsLoading(true);
      setLoadingMessage('Signing into your personal account...');
      console.log('🔑 Starting email authentication...');
      
      // Clear any existing demo data and global storage that might interfere
      console.log('🧹 Clearing any existing demo/global data before personal login...');
      localStorage.removeItem('planora_demo_user');
      localStorage.removeItem('planora_boards_demo-user-123');
      localStorage.removeItem('planora_lists_demo-user-123');
      localStorage.removeItem('planora_cards_demo-user-123');
      // Also clear global storage to prevent contamination
      localStorage.removeItem('planora_boards');
      localStorage.removeItem('planora_lists');
      localStorage.removeItem('planora_cards');
      
      const user = await dispatch(loginWithEmail({ email, password })).unwrap();
      console.log('✅ Email authentication successful:', user);
      
      toast.success('Welcome back to your personal account!');
      
      // Navigate to personal boards page
      console.log('🚀 Navigating to personal boards...');
      window.location.href = '/boards';
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage('Connecting with Google...');
      console.log('🔑 Starting Google authentication...');
      
      // Clear any existing demo data and global storage that might interfere
      console.log('🧹 Clearing any existing demo/global data before personal login...');
      localStorage.removeItem('planora_demo_user');
      localStorage.removeItem('planora_boards_demo-user-123');
      localStorage.removeItem('planora_lists_demo-user-123');
      localStorage.removeItem('planora_cards_demo-user-123');
      // Also clear global storage to prevent contamination
      localStorage.removeItem('planora_boards');
      localStorage.removeItem('planora_lists');
      localStorage.removeItem('planora_cards');
      
      const user = await dispatch(loginWithGoogle()).unwrap();
      console.log('✅ Google authentication successful:', user);
      
      toast.success('Welcome to your personal account!');
      
      // Navigate to personal boards page
      console.log('🚀 Navigating to personal boards...');
      window.location.href = '/boards';
      
    } catch (error) {
      console.error('❌ Google login failed:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Check for specific Firebase auth errors
      const errorCode = (error as any)?.code;
      let errorMessage = 'Google login failed. Please try again.';
      
      if (errorCode === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please enable popups and try again.';
      } else if (errorCode === 'auth/popup-closed-by-user') {
        errorMessage = 'Login was cancelled.';
      } else if (errorCode === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google login.';
      } else if (errorCode === 'auth/operation-not-allowed') {
        errorMessage = 'Google login is not enabled for this project.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsLoading(true);
      setLoadingMessage('Creating your account...');
      console.log('🔑 Starting account registration...');
      
      // Clear any existing demo data and global storage for clean start
      console.log('🧹 Clearing any existing data before account creation...');
      localStorage.removeItem('planora_demo_user');
      localStorage.removeItem('planora_boards_demo-user-123');
      localStorage.removeItem('planora_lists_demo-user-123');
      localStorage.removeItem('planora_cards_demo-user-123');
      // Also clear global storage to prevent contamination
      localStorage.removeItem('planora_boards');
      localStorage.removeItem('planora_lists');
      localStorage.removeItem('planora_cards');
      
      const user = await dispatch(registerWithEmail({ email, password, displayName: email.split('@')[0] })).unwrap();
      console.log('✅ Account registration successful:', user);
      
      toast.success('Account created successfully! Welcome to your personal boards!');
      
      // Navigate to personal boards page
      console.log('🚀 Navigating to personal boards...');
      window.location.href = '/boards';
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Loading overlay */}
      <LoadingOverlay isVisible={isLoading} message={loadingMessage} variant="gradient" />
      
      {/* Floating background orbs */}
      <FloatingOrb className="top-20 left-20 w-96 h-96 bg-gray-600" delay={0} />
      <FloatingOrb className="bottom-20 right-20 w-80 h-80 bg-gray-700" delay={2} />
      <FloatingOrb className="top-1/2 left-1/3 w-64 h-64 bg-gray-800" delay={4} />
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Hero */}
        <div className="flex-1 flex items-center justify-center p-8">
          <FadeInUp className="max-w-2xl text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Planora
            </h1>
            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Transform your project management with beautiful, intuitive boards that adapt to your workflow.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Real-time collaboration
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Advanced analytics
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Customizable workflows
              </span>
            </div>
          </FadeInUp>
        </div>

        {/* Right side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-8">
          <ScaleIn className="w-full max-w-md">
            {authMode === 'choose' && (
              <motion.div
                className="backdrop-blur-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Get Started</h2>
                
                <div className="space-y-4">
                  {/* Demo Button */}
                  <motion.button
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 hover:from-gray-500 hover:to-gray-600 hover:shadow-lg hover:shadow-gray-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-lg">Try Demo (No Account Required)</span>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </>
                    )}
                  </motion.button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900 text-gray-400">or</span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <motion.button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white text-gray-900 py-3 px-6 rounded-2xl font-medium transition-all duration-300 hover:bg-gray-100 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google (Personal Account)
                  </motion.button>

                  {/* Email Login */}
                  <motion.button
                    onClick={() => setAuthMode('login')}
                    className="w-full bg-gray-800 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-300 hover:bg-gray-700 hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign in with Email (Personal Account)
                  </motion.button>

                  {/* Register */}
                  <motion.button
                    onClick={() => setAuthMode('register')}
                    className="w-full border border-gray-600 text-gray-300 py-3 px-6 rounded-2xl font-medium transition-all duration-300 hover:bg-gray-800 hover:border-gray-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Personal Account
                  </motion.button>
                </div>
              </motion.div>
            )}

            {authMode === 'login' && (
              <motion.div
                className="backdrop-blur-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Welcome Back</h2>
                
                <form onSubmit={handlePersonalLogin} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/10 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-300 hover:from-gray-500 hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
                  </motion.button>
                </form>

                <button
                  onClick={() => setAuthMode('choose')}
                  className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to options
                </button>
              </motion.div>
            )}

            {authMode === 'register' && (
              <motion.div
                className="backdrop-blur-lg bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Create Account</h2>
                
                <form onSubmit={handleRegister} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="password"
                      placeholder="Password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/10 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                      required
                      minLength={6}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-300 hover:from-gray-500 hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
                  </motion.button>
                </form>

                <button
                  onClick={() => setAuthMode('choose')}
                  className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to options
                </button>
              </motion.div>
            )}
          </ScaleIn>
        </div>
      </div>
    </div>
  );
};
