import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore, useExamEngine } from '@/store';
import { useTimer, useAutoSave, useBeforeUnload } from '@/hooks';
import { Timer, QuestionPalette, QuestionDisplay, SubjectSwitcher } from '@/components/exam';
import { Button, Alert } from '@/components/ui';
import { Question, Subject, ExamAttempt } from '@/types';
import { groupQuestionsBySubject, getQuestionsBySubject } from '@/utils';

interface ExamPageProps {
  attemptId?: string;
}

export const ExamPage: React.FC<ExamPageProps> = ({ attemptId }) => {
  const { currentAttempt, currentQuestions, updateCurrentAttempt, submitExam } = useAppStore();
  const { setAttempt, recordAnswer, markForReview, clearResponse, navigateToQuestion } = useExamEngine();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize
  useEffect(() => {
    if (currentAttempt) {
      setAttempt(currentAttempt);
    }
  }, [currentAttempt, setAttempt]);

  // Timer setup - 150 minutes (2.5 hours)
  const examDurationSeconds = 150 * 60;
  const elapsedSeconds = currentAttempt
    ? Math.floor((Date.now() - currentAttempt.startedAt) / 1000)
    : 0;
  const remainingSeconds = Math.max(0, examDurationSeconds - elapsedSeconds);

  const { seconds: timerSeconds, isRunning: isTimerRunning } = useTimer(remainingSeconds, () => {
    handleSubmitExam();
  });

  // Auto-save
  const { startAutoSave, stopAutoSave } = useAutoSave(async () => {
    if (currentAttempt) {
      await updateCurrentAttempt(currentAttempt);
    }
  }, 30000);

  useEffect(() => {
    startAutoSave();
    return () => stopAutoSave();
  }, [startAutoSave, stopAutoSave]);

  // Prevent accidental navigation
  useBeforeUnload(true, 'Are you sure you want to leave? Your exam will be auto-saved.');

  if (!currentAttempt || !currentQuestions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert type="error" title="Error" message="No active exam found" />
      </div>
    );
  }

  const groupedQuestions = groupQuestionsBySubject(currentQuestions);
  const currentQuestion = currentQuestions[currentAttempt.currentQuestionIndex];
  const userAnswer = currentAttempt.answers[currentQuestion?.id]?.answer;
  const markedForReview = currentAttempt.answers[currentQuestion?.id]?.markedForReview || false;

  const answeredQuestionIds = new Set(
    Object.entries(currentAttempt.answers)
      .filter(([_, answer]) => answer.answer !== undefined && answer.answer !== '')
      .map(([id]) => id)
  );

  const markedForReviewIds = new Set(
    Object.entries(currentAttempt.answers)
      .filter(([_, answer]) => answer.markedForReview)
      .map(([id]) => id)
  );

  const visitedQuestionIds = new Set(
    Object.entries(currentAttempt.answers).map(([id]) => id)
  );

  const questionsBySubject = getQuestionsBySubject(currentQuestions, currentAttempt.currentSubject);
  const currentQuestionIndexInSubject = questionsBySubject.findIndex(q => q.id === currentQuestion?.id);

  const handleAnswerChange = useCallback((answer: string | number) => {
    recordAnswer(currentQuestion.id, answer);
    const updated = { ...currentAttempt };
    if (!updated.answers[currentQuestion.id]) {
      updated.answers[currentQuestion.id] = {
        questionId: currentQuestion.id,
        markedForReview: false,
        visitedAt: Date.now(),
      };
    }
    updated.answers[currentQuestion.id].answer = answer;
    updated.answers[currentQuestion.id].answeredAt = Date.now();
    updateCurrentAttempt(updated);
  }, [currentQuestion, recordAnswer, currentAttempt, updateCurrentAttempt]);

  const handleMarkForReview = useCallback((marked: boolean) => {
    markForReview(currentQuestion.id, marked);
    const updated = { ...currentAttempt };
    if (!updated.answers[currentQuestion.id]) {
      updated.answers[currentQuestion.id] = {
        questionId: currentQuestion.id,
        markedForReview: marked,
        visitedAt: Date.now(),
      };
    } else {
      updated.answers[currentQuestion.id].markedForReview = marked;
    }
    updateCurrentAttempt(updated);
  }, [currentQuestion, markForReview, currentAttempt, updateCurrentAttempt]);

  const handleClearResponse = useCallback(() => {
    clearResponse(currentQuestion.id);
    const updated = { ...currentAttempt };
    if (updated.answers[currentQuestion.id]) {
      delete updated.answers[currentQuestion.id].answer;
      delete updated.answers[currentQuestion.id].answeredAt;
    }
    updateCurrentAttempt(updated);
  }, [currentQuestion, clearResponse, currentAttempt, updateCurrentAttempt]);

  const handleNavigatePrevious = useCallback(() => {
    if (currentAttempt.currentQuestionIndex > 0) {
      navigateToQuestion(currentAttempt.currentQuestionIndex - 1);
      const updated = { ...currentAttempt };
      updated.currentQuestionIndex -= 1;
      updateCurrentAttempt(updated);
    }
  }, [currentAttempt, navigateToQuestion, updateCurrentAttempt]);

  const handleNavigateNext = useCallback(() => {
    if (currentAttempt.currentQuestionIndex < currentQuestions.length - 1) {
      navigateToQuestion(currentAttempt.currentQuestionIndex + 1);
      const updated = { ...currentAttempt };
      updated.currentQuestionIndex += 1;
      updateCurrentAttempt(updated);
    }
  }, [currentAttempt, currentQuestions, navigateToQuestion, updateCurrentAttempt]);

  const handleSelectQuestion = useCallback((questionId: string) => {
    const index = currentQuestions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      navigateToQuestion(index);
      const updated = { ...currentAttempt };
      updated.currentQuestionIndex = index;
      updateCurrentAttempt(updated);
    }
  }, [currentQuestions, navigateToQuestion, currentAttempt, updateCurrentAttempt]);

  const handleSubjectChange = useCallback((subject: Subject) => {
    const subjectQuestions = getQuestionsBySubject(currentQuestions, subject);
    if (subjectQuestions.length > 0) {
      const firstQuestion = subjectQuestions[0];
      handleSelectQuestion(firstQuestion.id);
      const updated = { ...currentAttempt };
      updated.currentSubject = subject;
      updateCurrentAttempt(updated);
    }
  }, [currentQuestions, handleSelectQuestion, currentAttempt, updateCurrentAttempt]);

  const handleSubmitExam = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const result = await submitExam();
      if (result) {
        setSubmitMessage({ type: 'success', text: 'Exam submitted successfully!' });
        setTimeout(() => {
          window.location.href = `/results/${result.id}`;
        }, 2000);
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to submit exam. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [submitExam]);

  const answeredCount = answeredQuestionIds.size;
  const reviewCount = markedForReviewIds.size;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentAttempt.examName}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Question {currentAttempt.currentQuestionIndex + 1} of {currentQuestions.length}</p>
          </div>
          <Timer seconds={timerSeconds} isRunning={true} />
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-24 mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <SubjectSwitcher
                subjects={['PHYSICS', 'CHEMISTRY', 'MATHEMATICS']}
                currentSubject={currentAttempt.currentSubject}
                questionCounts={{
                  PHYSICS: groupedQuestions.PHYSICS.length,
                  CHEMISTRY: groupedQuestions.CHEMISTRY.length,
                  MATHEMATICS: groupedQuestions.MATHEMATICS.length,
                }}
                answeredCounts={{
                  PHYSICS: groupedQuestions.PHYSICS.filter(q => answeredQuestionIds.has(q.id)).length,
                  CHEMISTRY: groupedQuestions.CHEMISTRY.filter(q => answeredQuestionIds.has(q.id)).length,
                  MATHEMATICS: groupedQuestions.MATHEMATICS.filter(q => answeredQuestionIds.has(q.id)).length,
                }}
                onSubjectChange={handleSubjectChange}
              />
            </div>

            <QuestionDisplay
              question={currentQuestion}
              userAnswer={userAnswer}
              markedForReview={markedForReview}
              onAnswerChange={handleAnswerChange}
              onMarkForReview={handleMarkForReview}
              onClearResponse={handleClearResponse}
              onSaveAndNext={handleNavigateNext}
              onPrevious={handleNavigatePrevious}
              canGoPrevious={currentAttempt.currentQuestionIndex > 0}
              canGoNext={currentAttempt.currentQuestionIndex < currentQuestions.length - 1}
            />

            {/* Submit Button */}
            <div className="mt-6 flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSubmitModal(true)}
                className="font-semibold"
              >
                Review and Submit
              </Button>
            </div>
          </div>

          {/* Sidebar - Question Palette */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <QuestionPalette
                questions={currentQuestions}
                currentQuestionId={currentQuestion.id}
                answeredQuestions={answeredQuestionIds}
                markedForReviewQuestions={markedForReviewIds}
                visitedQuestions={visitedQuestionIds}
                onSelectQuestion={handleSelectQuestion}
              />

              {/* Statistics */}
              <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600 dark:text-green-400">Answered</span>
                    <span className="font-bold">{answeredCount}/{currentQuestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600 dark:text-yellow-400">Review</span>
                    <span className="font-bold">{reviewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Not Answered</span>
                    <span className="font-bold">{currentQuestions.length - answeredCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Submit Exam?</h2>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 mb-6 text-sm text-gray-700 dark:text-gray-300">
                <p className="mb-2"><strong>Answered:</strong> {answeredCount} questions</p>
                <p className="mb-2"><strong>Not Answered:</strong> {currentQuestions.length - answeredCount} questions</p>
                <p><strong>Marked for Review:</strong> {reviewCount} questions</p>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to submit? You cannot review or change answers after submission.</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1"
                >
                  Continue Exam
                </Button>
                <Button
                  variant="danger"
                  onClick={handleSubmitExam}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Submit Exam
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {submitMessage && (
        <div className="fixed top-24 right-4 z-50">
          <Alert
            type={submitMessage.type}
            title={submitMessage.type === 'success' ? 'Success' : 'Error'}
            message={submitMessage.text}
            onClose={() => setSubmitMessage(null)}
          />
        </div>
      )}
    </div>
  );
};
