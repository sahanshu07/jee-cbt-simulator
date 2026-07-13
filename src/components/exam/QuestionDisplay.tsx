import React from 'react';
import { Question, Subject } from '@/types';
import { getSubjectLabel, getSubjectColor } from '@/utils';

interface QuestionDisplayProps {
  question: Question;
  userAnswer?: string | number;
  markedForReview: boolean;
  onAnswerChange: (answer: string | number) => void;
  onMarkForReview: (marked: boolean) => void;
  onClearResponse: () => void;
  onSaveAndNext?: () => void;
  onPrevious?: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  userAnswer,
  markedForReview,
  onAnswerChange,
  onMarkForReview,
  onClearResponse,
  onSaveAndNext,
  onPrevious,
  canGoPrevious,
  canGoNext,
}) => {
  const subjectColor = getSubjectColor(question.subject);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Question Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded text-white font-bold text-sm"
              style={{ backgroundColor: subjectColor }}
            >
              {getSubjectLabel(question.subject)}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Question {question.number}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {question.marks} marks
            </span>
            {question.negativeMarks > 0 && (
              <span className="text-xs font-medium text-red-600 dark:text-red-400">
                -{question.negativeMarks} if wrong
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Question Body */}
      <div className="px-6 py-6">
        {/* Question Text */}
        <div className="mb-6 text-gray-900 dark:text-gray-50 leading-relaxed">
          <h2 className="text-lg font-medium mb-4">{question.question}</h2>
        </div>

        {/* Options or Input */}
        {question.type === 'MCQ' ? (
          <div className="space-y-3">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-center p-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={userAnswer === option.id}
                  onChange={e => onAnswerChange(e.target.value)}
                  className="w-5 h-5 text-indigo-600 cursor-pointer"
                />
                <span className="ml-3 text-gray-900 dark:text-gray-50">
                  <strong>{String.fromCharCode(65 + (question.options?.indexOf(option) || 0))}.</strong> {option.text}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your answer:
            </label>
            <input
              type="number"
              value={userAnswer !== undefined ? userAnswer : ''}
              onChange={e => onAnswerChange(e.target.value ? parseFloat(e.target.value) : '')}
              placeholder="Enter numerical answer"
              step="any"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-2">
        <button
          onClick={onClearResponse}
          disabled={userAnswer === undefined || userAnswer === ''}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear Response
        </button>

        <button
          onClick={() => onMarkForReview(!markedForReview)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            markedForReview
              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {markedForReview ? '✓ Marked for Review' : 'Mark for Review'}
        </button>

        <div className="flex-1" />

        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <button
          onClick={onSaveAndNext}
          disabled={!canGoNext}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          Save & Next →
        </button>
      </div>
    </div>
  );
};
