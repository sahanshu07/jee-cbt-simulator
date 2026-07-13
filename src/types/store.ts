import { Question, ExamConfig, ExamAttempt, ExamResult } from './index';

export interface StoreState {
  // Exams
  exams: ExamConfig[];
  currentExamId: string | null;
  
  // Current Attempt
  currentAttempt: ExamAttempt | null;
  
  // Results
  results: ExamResult[];
  
  // UI State
  darkMode: boolean;
  sidebarOpen: boolean;
}

export interface ExamStore {
  // Exam Management
  setExams: (exams: ExamConfig[]) => void;
  addExam: (exam: ExamConfig) => void;
  deleteExam: (examId: string) => void;
  
  // Attempt Management
  startExam: (examId: string, questions: Question[]) => void;
  updateAttempt: (attempt: ExamAttempt) => void;
  resumeExam: (attemptId: string) => void;
  submitExam: (attemptId: string) => ExamResult | null;
  clearCurrentAttempt: () => void;
  
  // Results
  getResults: (examId?: string) => ExamResult[];
  addResult: (result: ExamResult) => void;
  
  // UI
  setDarkMode: (enabled: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}
