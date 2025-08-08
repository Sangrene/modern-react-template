import React from 'react';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'medium', 
  color = 'currentColor',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div 
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-transparent ${sizeClasses[size]} ${className}`}
      style={{ borderTopColor: color }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}; 