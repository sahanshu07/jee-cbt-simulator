import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  size = 'md',
  showLabel = true,
}) => {
  const displayPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div>
      {showLabel && label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{displayPercentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
    </div>
  );
};
