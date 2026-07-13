import React from 'react';
import { Question } from '@/types';
import { Badge } from '@/components/ui';

interface QuestionPaletteProps {
  questions: Question[];
  currentQuestionId: string;
  answeredQuestions: Set<string>;
  markedForReviewQuestions: Set<string>;
  visitedQuestions: Set<string>;
  onSelectQuestion: (questionId: string) => void;
}

const getQuestionStatus = (
  questionId: string,
  answered: Set<string>,
  markedForReview: Set<string>,
  visited: Set<string>
): 'unanswered' | 'answered' | 'review' | 'visited' => {
  if (markedForReview.has(questionId)) return 'review';
  if (answered.has(questionId)) return 'answered';
  if (visited.has(questionId)) return 'visited';
  return 'unanswered';
};

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentQuestionId,
  answeredQuestions,
  markedForReviewQuestions,
  visitedQuestions,
  onSelectQuestion,
}) => {
  const statusColors = {
    answered: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300',
    unanswered: 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300',
    review: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
    visited: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300',
  };

  const statusLabels = {
    answered: '✓',
    unanswered: '✕',
    review: '!',
    visited: 'V',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-800">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Question Palette</h3>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded flex items-center justify-center text-green-700 dark:text-green-300 text-xs font-bold">✓</div>
          <span className="text-gray-600 dark:text-gray-400">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded flex items-center justify-center text-red-700 dark:text-red-300 text-xs font-bold">✕</div>
          <span className="text-gray-600 dark:text-gray-400">Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded flex items-center justify-center text-yellow-700 dark:text-yellow-300 text-xs font-bold">!</div>
          <span className="text-gray-600 dark:text-gray-400">Mark for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold">V</div>
          <span className="text-gray-600 dark:text-gray-400">Visited</span>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {questions.map(question => {
          const status = getQuestionStatus(
            question.id,
            answeredQuestions,
            markedForReviewQuestions,
            visitedQuestions
          );
          const isCurrent = question.id === currentQuestionId;

          return (
            <button
              key={question.id}
              onClick={() => onSelectQuestion(question.id)}
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded border-2 font-bold text-xs
                flex items-center justify-center transition-all
                ${isCurrent
                  ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-900'
                  : ''
                }
                ${statusColors[status]}
              `}
              title={`Question ${question.number} - ${status}`}
            >
              {statusLabels[status]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
