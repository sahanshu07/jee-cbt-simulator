import create from 'zustand';
import { ExamAttempt, UserAnswer } from '@/types';

interface ExamEngineState {
  attempt: ExamAttempt | null;
  timerSeconds: number;
  isTimerRunning: boolean;
  autoSaveInterval: NodeJS.Timeout | null;
  
  // Actions
  setAttempt: (attempt: ExamAttempt) => void;
  updateTimer: (seconds: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  recordAnswer: (questionId: string, answer: string | number) => void;
  markForReview: (questionId: string, marked: boolean) => void;
  clearResponse: (questionId: string) => void;
  navigateToQuestion: (questionIndex: number) => void;
  setAutoSaveInterval: (interval: NodeJS.Timeout | null) => void;
}

export const useExamEngine = create<ExamEngineState>((set, get) => ({
  attempt: null,
  timerSeconds: 0,
  isTimerRunning: false,
  autoSaveInterval: null,
  
  setAttempt: (attempt: ExamAttempt) => {
    set({ attempt });
    const remainingSeconds = (attempt.startedAt + 150 * 60 * 1000 - Date.now()) / 1000;
    set({ timerSeconds: Math.max(0, Math.ceil(remainingSeconds)) });
  },
  
  updateTimer: (seconds: number) => {
    set({ timerSeconds: Math.max(0, seconds) });
  },
  
  startTimer: () => {
    set({ isTimerRunning: true });
  },
  
  stopTimer: () => {
    set({ isTimerRunning: false });
  },
  
  recordAnswer: (questionId: string, answer: string | number) => {
    const { attempt } = get();
    if (!attempt) return;
    
    const updated = { ...attempt };
    if (!updated.answers[questionId]) {
      updated.answers[questionId] = {
        questionId,
        markedForReview: false,
        visitedAt: Date.now(),
      };
    }
    updated.answers[questionId].answer = answer;
    updated.answers[questionId].answeredAt = Date.now();
    
    set({ attempt: updated });
  },
  
  markForReview: (questionId: string, marked: boolean) => {
    const { attempt } = get();
    if (!attempt) return;
    
    const updated = { ...attempt };
    if (!updated.answers[questionId]) {
      updated.answers[questionId] = {
        questionId,
        markedForReview: marked,
        visitedAt: Date.now(),
      };
    } else {
      updated.answers[questionId].markedForReview = marked;
    }
    
    set({ attempt: updated });
  },
  
  clearResponse: (questionId: string) => {
    const { attempt } = get();
    if (!attempt) return;
    
    const updated = { ...attempt };
    if (updated.answers[questionId]) {
      delete updated.answers[questionId].answer;
      updated.answers[questionId].answeredAt = undefined;
    }
    
    set({ attempt: updated });
  },
  
  navigateToQuestion: (questionIndex: number) => {
    const { attempt } = get();
    if (!attempt) return;
    
    const updated = { ...attempt };
    updated.currentQuestionIndex = questionIndex;
    
    set({ attempt: updated });
  },
  
  setAutoSaveInterval: (interval: NodeJS.Timeout | null) => {
    set({ autoSaveInterval: interval });
  },
}));
