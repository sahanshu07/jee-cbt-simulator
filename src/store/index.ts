import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Exam, Question, ExamAttempt, Subject } from '@/types';

interface AppStoreState {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;

  exams: Exam[];
  loadExams: () => Promise<void>;
  addExam: (exam: Exam, questions: Question[]) => Promise<void>;
  getExamById: (id: string) => Exam | undefined;

  currentAttempt: ExamAttempt | null;
  currentQuestions: Question[] | null;
  attemptHistory: ExamAttempt[];

  startExam: (examId: string) => Promise<void>;
  updateCurrentAttempt: (attempt: ExamAttempt) => Promise<void>;
  submitExam: () => Promise<ExamAttempt | null>;
  getAttemptById: (id: string) => ExamAttempt | undefined;
}

const initialState = {
  exams: [],
  currentAttempt: null,
  currentQuestions: null,
  attemptHistory: [],
};

export const useAppStore = create<AppStoreState>()(persist(
  (set, get) => ({
    ...initialState,

    // Dark mode
    darkMode: false,
    setDarkMode: (dark: boolean) => {
      set({ darkMode: dark });
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    // Exams
    loadExams: async () => {
      // In a real app, this would fetch from a database
      // For now, we'll load from localStorage
    },

    addExam: async (exam: Exam, questions: Question[]) => {
      const state = get();
      set({ exams: [...state.exams, exam] });
      // Store questions separately
      localStorage.setItem(`exam-questions-${exam.id}`, JSON.stringify(questions));
    },

    getExamById: (id: string) => {
      return get().exams.find(e => e.id === id);
    },

    // Attempt management
    startExam: async (examId: string) => {
      const exam = get().getExamById(examId);
      if (!exam) return;

      const questions: Question[] = JSON.parse(
        localStorage.getItem(`exam-questions-${examId}`) || '[]'
      );

      const attempt: ExamAttempt = {
        id: `attempt-${Date.now()}`,
        examId,
        examName: exam.name,
        startedAt: Date.now(),
        answers: {},
        currentQuestionIndex: 0,
        currentSubject: 'PHYSICS',
        totalQuestions: exam.totalQuestions,
        totalMarks: exam.totalMarks,
        correctAnswers: 0,
        obtainedMarks: 0,
        completedAt: 0,
      };

      set({
        currentAttempt: attempt,
        currentQuestions: questions,
      });
    },

    updateCurrentAttempt: async (attempt: ExamAttempt) => {
      set({ currentAttempt: attempt });
      // Auto-persist to localStorage
      localStorage.setItem(`attempt-${attempt.id}`, JSON.stringify(attempt));
    },

    submitExam: async () => {
      const state = get();
      const attempt = state.currentAttempt;
      const questions = state.currentQuestions;

      if (!attempt || !questions) return null;

      // Calculate results
      let correctAnswers = 0;
      let obtainedMarks = 0;

      questions.forEach(question => {
        const userAnswer = attempt.answers[question.id]?.answer;
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
          obtainedMarks += question.marks;
        } else if (userAnswer !== undefined && userAnswer !== '') {
          obtainedMarks -= question.negativeMarks;
        }
      });

      const completedAttempt: ExamAttempt = {
        ...attempt,
        correctAnswers,
        obtainedMarks,
        completedAt: Date.now(),
      };

      const history = [...state.attemptHistory, completedAttempt];
      set({
        currentAttempt: null,
        currentQuestions: null,
        attemptHistory: history,
      });

      // Persist
      localStorage.setItem(`attempt-${completedAttempt.id}`, JSON.stringify(completedAttempt));
      localStorage.setItem('attempt-history', JSON.stringify(history));

      return completedAttempt;
    },

    getAttemptById: (id: string) => {
      const state = get();
      const fromHistory = state.attemptHistory.find(a => a.id === id);
      if (fromHistory) return fromHistory;

      const stored = localStorage.getItem(`attempt-${id}`);
      if (stored) return JSON.parse(stored);

      return undefined;
    },
  }),
  {
    name: 'jee-cbt-store',
  }
));

export const useExamEngine = () => {
  const store = useAppStore();

  return {
    setAttempt: (attempt: ExamAttempt) => {
      // This would be used for exam-specific logic
    },
    recordAnswer: (questionId: string, answer: string | number) => {
      // Logic for recording answers
    },
    markForReview: (questionId: string, marked: boolean) => {
      // Logic for marking questions for review
    },
    clearResponse: (questionId: string) => {
      // Logic for clearing responses
    },
    navigateToQuestion: (index: number) => {
      // Logic for question navigation
    },
  };
};
