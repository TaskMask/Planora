import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-200"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'flex h-10 w-full rounded-lg border px-3 py-2 text-sm bg-gray-800/50 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-200',
          error
            ? 'border-red-500 focus:border-red-400 focus:ring-red-500'
            : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};
