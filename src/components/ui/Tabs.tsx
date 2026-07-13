import React, { useState } from 'react';

export interface TabsProps {
  tabs: Array<{ label: string; value: string }>;
  defaultValue: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultValue, onChange, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              onChange(tab.value);
            }}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab.value
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
};
