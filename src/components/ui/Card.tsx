import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-900
        rounded-lg shadow-md dark:shadow-lg
        border border-gray-200 dark:border-gray-800
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-lg dark:hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
