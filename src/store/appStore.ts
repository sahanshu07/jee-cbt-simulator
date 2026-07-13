import create from 'zustand';
import { persist } from 'zustand/middleware';
import { ExamConfig, ExamAttempt, ExamResult, Question } from '@/types';
import { examService } from '@/db';
import { ResultCalculator } from '@/db/resultCalculator';

interface AppState {
  // Exams
  exams: ExamConfig[];
  currentExamId: string | null;
  
  // Current Attempt
  currentAttempt: ExamAttempt | null;
  currentQuestions: Question[];
  
  // Results
  results: ExamResult[];
  
  // UI State
  darkMode: boolean;
  sidebarOpen: boolean;
  
  // Actions
  loadExams: () => Promise<void>;
  addExam: (exam: ExamConfig, questions: Question[]) => Promise<void>;
  deleteExam: (examId: string) => Promise<void>;
  
  startExam: (examId: string) => Promise<void>;
  resumeExam: (attemptId: string) => Promise<void>;
  updateCurrentAttempt: (attempt: ExamAttempt) => Promise<void>;
  submitExam: () => Promise<ExamResult | null>;
  clearCurrentAttempt: () => void;
  
  loadResults: () => Promise<void>;
  
  setDarkMode: (enabled: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>(
  persist(
    (set, get) => ({
      exams: [],
      currentExamId: null,
      currentAttempt: null,
      currentQuestions: [],
      results: [],
      darkMode: false,
      sidebarOpen: true,
      
      loadExams: async () => {
        const exams = await examService.getAllExams();
        set({ exams });
      },
      
      addExam: async (exam: ExamConfig, questions: Question[]) => {
        await examService.saveExam(exam, questions.map(q => ({ ...q, examId: exam.id } as any)));
        const exams = await examService.getAllExams();
        set({ exams });
      },
      
      deleteExam: async (examId: string) => {
        await examService.deleteExam(examId);
        const exams = await examService.getAllExams();
        set({ exams });
      },
      
      startExam: async (examId: string) => {
        const exam = await examService.getExam(examId);
        if (!exam) return;
        
        const questions = await examService.getQuestions(examId);
        const attemptId = `attempt-${examId}-${Date.now()}`;
        
        const attempt: ExamAttempt = {
          id: attemptId,
          examId,
          examName: exam.name,
          startedAt: Date.now(),
          answers: {},
          currentQuestionIndex: 0,
          currentSubject: 'PHYSICS',
          totalTimeSpent: 0,
          isCompleted: false,
        };
        
        // Initialize answers
        questions.forEach(q => {
          attempt.answers[q.id] = {
            questionId: q.id,
            markedForReview: false,
            visitedAt: Date.now(),
          };
        });
        
        await examService.saveAttempt(attempt);
        set({ currentExamId: examId, currentAttempt: attempt, currentQuestions: questions });
      },
      
      resumeExam: async (attemptId: string) => {
        const attempt = await examService.getAttempt(attemptId);
        if (!attempt) return;
        
        const questions = await examService.getQuestions(attempt.examId);
        set({ currentExamId: attempt.examId, currentAttempt: attempt, currentQuestions: questions });
      },
      
      updateCurrentAttempt: async (attempt: ExamAttempt) => {
        await examService.saveAttempt(attempt);
        set({ currentAttempt: attempt });
      },
      
      submitExam: async () => {
        const { currentAttempt, currentQuestions } = get();
        if (!currentAttempt || !currentQuestions) return null;
        
        const completedAttempt = {
          ...currentAttempt,
          endedAt: Date.now(),
          isCompleted: true,
          submittedAt: Date.now(),
        };
        
        const result = ResultCalculator.calculateResult(completedAttempt, currentQuestions);
        await examService.saveResult(result);
        await examService.saveAttempt(completedAttempt);
        
        const results = await examService.getAllResults();
        set({ results, currentAttempt: null, currentQuestions: [] });
        
        return result;
      },
      
      clearCurrentAttempt: () => {
        set({ currentAttempt: null, currentQuestions: [], currentExamId: null });
      },
      
      loadResults: async () => {
        const results = await examService.getAllResults();
        set({ results });
      },
      
      setDarkMode: (enabled: boolean) => {
        set({ darkMode: enabled });
        if (enabled) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },
    }),
    {
      name: 'jee-simulator-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
