import React from 'react';

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const typeStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${typeStyles[type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl font-bold">{icons[type]}</span>
          <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm mt-1">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl opacity-50 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
