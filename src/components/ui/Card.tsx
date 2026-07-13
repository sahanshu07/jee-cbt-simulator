import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
