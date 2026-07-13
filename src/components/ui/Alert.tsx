import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

const typeStyles = {
  success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
  error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
  warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
  info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
};

const typeIcons = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'ℹ',
};

const typeColors = {
  success: 'text-green-800 dark:text-green-200',
  error: 'text-red-800 dark:text-red-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  info: 'text-blue-800 dark:text-blue-200',
};

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  return (
    <div className={`border-l-4 p-4 rounded ${typeStyles[type]}`}>
      <div className="flex items-start">
        <span className={`text-lg font-bold mr-3 ${typeColors[type]}`}>{typeIcons[type]}</span>
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${typeColors[type]}`}>{title}</h3>}
          <p className={typeColors[type]}>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className={`ml-2 ${typeColors[type]} hover:opacity-75`}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
