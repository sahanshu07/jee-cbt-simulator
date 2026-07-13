import React from 'react';
import { formatTime } from '@/utils';

interface TimerProps {
  seconds: number;
  isRunning: boolean;
  onTimeUp?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ seconds, isRunning }) => {
  const isWarning = seconds < 300; // Less than 5 minutes
  const isCritical = seconds < 60; // Less than 1 minute

  return (
    <div
      className={`
        flex items-center justify-center font-mono text-2xl font-bold
        px-4 py-2 rounded-lg transition-all duration-300
        ${isCritical
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
          : isWarning
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
          : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
        }
      `}
    >
      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.447.894l1.414 1.414a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
      </svg>
      {formatTime(seconds)}
    </div>
  );
};
