import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'gradient';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[0]} bg-gradient-to-r from-violet-500 to-purple-500 rounded-full`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
              boxShadow: [
                "0 0 5px rgba(139, 92, 246, 0.3)",
                "0 0 15px rgba(139, 92, 246, 0.6)",
                "0 0 5px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-r from-violet-500 to-purple-500 rounded-full ${className}`}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  if (variant === 'gradient') {
    return (
      <motion.div
        className={`${sizeClasses[size]} rounded-full relative ${className}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div 
          className={`${sizeClasses[size]} rounded-full`}
          style={{
            background: `conic-gradient(from 0deg, transparent, #8b5cf6, #a855f7, transparent)`
          }}
        />
      </motion.div>
    );
  }

  // Default spinner
  return (
    <motion.div
      className={`${sizeClasses[size]} border-4 border-gray-600 border-t-blue-500 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: 'default' | 'gradient' | 'dots';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Loading...', 
  variant = 'gradient' 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 flex flex-col items-center space-y-4 border border-gray-600/30"
      >
        <LoadingSpinner size="xl" variant={variant} />
        <p className="text-gray-200 text-lg font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
};
