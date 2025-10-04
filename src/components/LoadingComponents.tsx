import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-amber-500 border-t-transparent ${sizeClasses[size]} ${className}`} />
  );
};

interface LoadingStateProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  children, 
  className = 'py-20' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <LoadingSpinner size="large" />
      {children && (
        <p className="mt-4 text-slate-600 text-lg">
          {children}
        </p>
      )}
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  className = 'py-20' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-red-500 text-xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        Something went wrong
      </h3>
      <p className="text-slate-600 mb-4 text-center max-w-md">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
        >
          Try Again
        </button>
      )}
    </div>
  );
};