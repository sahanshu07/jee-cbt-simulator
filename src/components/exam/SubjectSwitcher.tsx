import React from 'react';
import { Subject } from '@/types';
import { getSubjectLabel, getSubjectColor } from '@/utils';

interface SubjectSwitcherProps {
  subjects: Subject[];
  currentSubject: Subject;
  questionCounts: Record<Subject, number>;
  answeredCounts: Record<Subject, number>;
  onSubjectChange: (subject: Subject) => void;
}

export const SubjectSwitcher: React.FC<SubjectSwitcherProps> = ({
  subjects,
  currentSubject,
  questionCounts,
  answeredCounts,
  onSubjectChange,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {subjects.map(subject => {
        const color = getSubjectColor(subject);
        const isActive = currentSubject === subject;
        const answered = answeredCounts[subject] || 0;
        const total = questionCounts[subject] || 0;

        return (
          <button
            key={subject}
            onClick={() => onSubjectChange(subject)}
            style={{
              borderColor: isActive ? color : 'transparent',
              backgroundColor: isActive ? `${color}20` : 'transparent',
            }}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all border-2
              ${isActive
                ? 'text-gray-900 dark:text-gray-50'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <div>{getSubjectLabel(subject)}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {answered}/{total}
            </div>
          </button>
        );
      })}
    </div>
  );
};
