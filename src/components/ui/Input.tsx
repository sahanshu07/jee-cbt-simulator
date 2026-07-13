import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700
          rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50
          focus:outline-none focus:border-indigo-500
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};
