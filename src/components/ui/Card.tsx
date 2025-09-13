import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      className={clsx(
        'rounded-2xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm shadow-xl shadow-black/20',
        paddingClasses[padding],
        onClick && 'cursor-pointer hover:bg-gray-800/70 transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
