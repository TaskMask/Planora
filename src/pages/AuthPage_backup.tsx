import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import type { AppDispatch } from '../store';
import { loginDemo, loginWithEmail, registerWithEmail, loginWithGoogle } from '../features/auth/authSlice';
import { resetSampleData } from '../utils/seedData';
import { LoadingSpinner, LoadingOverlay } from '../components/ui/LoadingSpinner';
import { FadeInUp, ScaleIn, SlideInLeft, SlideInRight, FloatingElement, PulseGlow } from '../components/ui/Animations';
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
  const [authMode, setAuthMode] = useState<'choose' | 'login' | 'register'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 Starting demo login process...');
      
      // Clear localStorage data but don't sign out
      console.log('🧹 Clearing existing demo data...');
      localStorage.removeItem('planora_boards');
      localStorage.removeItem('planora_lists');
      localStorage.removeItem('planora_cards');
      
      // Dispatch demo login action (this will handle sign in via authSlice)
      console.log('� Dispatching demo login action...');
      const demoUser = await dispatch(loginDemo()).unwrap();
      console.log('✅ Demo user signed in:', demoUser);
      
      // Load fresh sample data
      console.log('📊 Loading fresh sample data...');
      resetSampleData(demoUser.id, dispatch);
      console.log('✅ Fresh sample data loaded to localStorage and Redux');
      
      console.log('� Navigating to boards page...');
      toast.success('Welcome to the demo! Explore the portfolio-ready features.');
      
      // Navigation should happen automatically via useAuth hook detecting user state change
      // But add fallback navigation just in case
      setTimeout(() => {
        if (window.location.pathname === '/') {
          navigate('/boards');
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Demo login failed:', error);
      toast.error(`Failed to load demo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(loginWithEmail({ email, password })).unwrap();
      toast.success('Logged in successfully!');
      navigate('/boards');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await dispatch(loginWithGoogle()).unwrap();
      toast.success('Logged in with Google successfully!');
      navigate('/boards');
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(registerWithEmail({ email, password, displayName: email.split('@')[0] })).unwrap();
      toast.success('Account created successfully!');
      navigate('/boards');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authMode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        <LoadingOverlay isVisible={isLoading} message="Loading demo experience..." variant="gradient" />
        
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingOrb className="top-1/4 left-1/4 w-96 h-96 bg-violet-600/8" delay={0} />
          <FloatingOrb className="bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8" delay={2} />
          <FloatingOrb className="top-3/4 left-3/4 w-64 h-64 bg-violet-700/6" delay={4} />
          <FloatingOrb className="bottom-3/4 right-3/4 w-72 h-72 bg-purple-700/6" delay={6} />
          
          {/* Animated grid */}
          <motion.div 
            className="absolute inset-0 opacity-5"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-violet-300/5 to-transparent 
                           bg-[length:50px_50px] 
                           bg-[image:radial-gradient(circle_at_25px_25px,white_1px,transparent_1px)]" />
          </motion.div>
        </div>
        
        <ScaleIn className="relative z-10">
          <PulseGlow className="glass rounded-3xl p-8 w-full max-w-md border border-gray-700/30 bg-black/40 backdrop-blur-xl">
            <FadeInUp className="text-center mb-8">
              <motion.h1 
                className="text-5xl font-bold bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent mb-2"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  textShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.3)",
                    "0 0 30px rgba(139, 92, 246, 0.5)",
                    "0 0 20px rgba(139, 92, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Planora
              </motion.h1>
              <motion.p 
                className="text-gray-400 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Portfolio-ready project management
              </motion.p>
            </FadeInUp>

            <div className="space-y-4">
              <SlideInLeft delay={0.2}>
                <motion.button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-900/80 to-purple-900/80 hover:from-violet-800/90 hover:to-purple-800/90 text-white font-semibold py-5 px-6 rounded-2xl 
                           transition-all duration-500 transform hover:scale-105 
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
                           flex items-center justify-center space-x-3 group relative overflow-hidden
                           shadow-lg hover:shadow-violet-500/25 border border-violet-700/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FloatingElement>
                    <span className="text-2xl">🚀</span>
                  </FloatingElement>
                  <span className="text-lg">Experience Demo</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </SlideInLeft>
              
              <FadeInUp delay={0.4}>
                <p className="text-xs text-gray-500 text-center">
                  Explore with curated portfolio data
                </p>
              </FadeInUp>

              <SlideInRight delay={0.5}>
                <div className="relative my-8">
                  <motion.div 
                    className="absolute inset-0 flex items-center"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="w-full border-t border-gray-700"></div>
                  </motion.div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-black/60 text-gray-400 rounded-full border border-gray-700/30">or continue with</span>
                  </div>
                </div>
              </SlideInRight>

              <SlideInLeft delay={0.7}>
                <motion.button
                  onClick={() => setAuthMode('login')}
                  disabled={isLoading}
                  className="w-full bg-gray-900/50 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-2xl 
                           transition-all duration-300 transform hover:scale-105 
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
                           border border-violet-700/40 hover:border-violet-600/60 hover:bg-violet-900/20 group relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>🔐</span>
                    <span>Personal Account</span>
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-purple-600/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </SlideInLeft>

              <SlideInRight delay={0.9}>
                <motion.button
                  onClick={() => setAuthMode('register')}
                  disabled={isLoading}
                  className="w-full border-2 border-violet-700/60 text-violet-200 hover:bg-violet-800/20 
                           hover:text-violet-100 hover:border-violet-600/80 font-semibold py-4 px-6 rounded-2xl 
                           transition-all duration-300 transform hover:scale-105 
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
                           group relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>✨</span>
                    <span>Create Account</span>
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-violet-700/15"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </SlideInRight>
            </div>
          </PulseGlow>
        </ScaleIn>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-violet-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  }

  if (authMode === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingOrb className="top-1/4 left-1/4 w-80 h-80 bg-violet-600/8" delay={0} />
          <FloatingOrb className="bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/8" delay={3} />
        </div>
        
        <ScaleIn className="relative z-10">
          <PulseGlow className="glass rounded-3xl p-8 w-full max-w-md border border-gray-700/30 bg-black/40 backdrop-blur-xl">
            <FadeInUp className="text-center mb-8">
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent mb-2"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Sign in to your Planora account
              </motion.p>
            </FadeInUp>

            <form onSubmit={handlePersonalLogin} className="space-y-6">
              <SlideInLeft delay={0.2}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 
                             focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>
              </SlideInLeft>

              <SlideInRight delay={0.4}>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                    Password
                  </label>
                  <motion.input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 
                             focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>
              </SlideInRight>

              <FadeInUp delay={0.6}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-900/80 to-purple-900/80 hover:from-violet-800/90 hover:to-purple-800/90 text-white font-semibold py-4 px-6 rounded-xl 
                           transition-all duration-300 transform hover:scale-105 
                           disabled:opacity-50 disabled:transform-none group relative overflow-hidden border border-violet-700/30
                           shadow-lg hover:shadow-violet-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" variant="dots" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>🔓</span>
                        <span>Sign In</span>
                      </>
                    )}
                  </span>
                </motion.button>
              </FadeInUp>
            </form>

            <SlideInLeft delay={0.8}>
              <div className="relative my-6">
                <motion.div 
                  className="absolute inset-0 flex items-center"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <div className="w-full border-t border-gray-600"></div>
                </motion.div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 glass-dark text-gray-300 rounded-full">or</span>
                </div>
              </div>
            </SlideInLeft>

            <SlideInRight delay={1.0}>
              <motion.button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full glass border border-white/20 text-white font-semibold py-4 px-6 
                         rounded-xl transition-all duration-300 transform hover:scale-105 
                         disabled:opacity-50 disabled:transform-none flex items-center justify-center 
                         space-x-3 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.svg 
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 12 }}
                >
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </motion.svg>
                <span>Continue with Google</span>
              </motion.button>
            </SlideInRight>

            <FadeInUp delay={1.2}>
              <motion.button
                onClick={() => setAuthMode('choose')}
                className="w-full mt-6 text-gray-400 hover:text-white font-medium 
                         transition-colors duration-300 hover:scale-105 transform flex items-center 
                         justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>←</span>
                <span>Back to options</span>
              </motion.button>
            </FadeInUp>
          </PulseGlow>
        </ScaleIn>
      </div>
    );
  }

  if (authMode === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingOrb className="top-1/3 left-1/3 w-96 h-96 bg-violet-600/8" delay={0} />
          <FloatingOrb className="bottom-1/3 right-1/3 w-80 h-80 bg-purple-600/8" delay={2} />
          <FloatingOrb className="top-2/3 left-2/3 w-64 h-64 bg-violet-700/6" delay={4} />
        </div>
        
        <ScaleIn className="relative z-10">
          <PulseGlow className="glass rounded-3xl p-8 w-full max-w-md border border-gray-700/30 bg-black/40 backdrop-blur-xl">
            <FadeInUp className="text-center mb-8">
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent mb-2"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Join Planora
              </motion.h1>
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Create your account today
              </motion.p>
            </FadeInUp>

            <form onSubmit={handleRegister} className="space-y-6">
              <SlideInLeft delay={0.2}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 
                             focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>
              </SlideInLeft>

              <SlideInRight delay={0.4}>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                    Password
                  </label>
                  <motion.input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 
                             focus:border-transparent transition-all duration-300"
                    placeholder="Create a strong password"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>
              </SlideInRight>

              <FadeInUp delay={0.6}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-900/80 to-purple-900/80 hover:from-violet-800/90 
                           hover:to-purple-800/90 text-white font-semibold py-4 px-6 rounded-xl 
                           transition-all duration-300 transform hover:scale-105 
                           disabled:opacity-50 disabled:transform-none group relative overflow-hidden
                           shadow-lg hover:shadow-violet-500/25 border border-violet-700/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" variant="dots" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        <span>Create Account</span>
                      </>
                    )}
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </FadeInUp>
            </form>

            <SlideInLeft delay={0.8}>
              <div className="relative my-6">
                <motion.div 
                  className="absolute inset-0 flex items-center"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <div className="w-full border-t border-gray-600"></div>
                </motion.div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 glass-dark text-gray-300 rounded-full">or</span>
                </div>
              </div>
            </SlideInLeft>

            <SlideInRight delay={1.0}>
              <motion.button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full glass border border-white/20 text-white font-semibold py-4 px-6 
                         rounded-xl transition-all duration-300 transform hover:scale-105 
                         disabled:opacity-50 disabled:transform-none flex items-center justify-center 
                         space-x-3 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.svg 
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 12 }}
                >
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </motion.svg>
                <span>Continue with Google</span>
              </motion.button>
            </SlideInRight>

            <FadeInUp delay={1.2}>
              <motion.button
                onClick={() => setAuthMode('choose')}
                className="w-full mt-6 text-gray-400 hover:text-white font-medium 
                         transition-colors duration-300 hover:scale-105 transform flex items-center 
                         justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>←</span>
                <span>Back to options</span>
              </motion.button>
            </FadeInUp>
          </PulseGlow>
        </ScaleIn>

        {/* Floating particles for register mode */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

export default AuthPage;
