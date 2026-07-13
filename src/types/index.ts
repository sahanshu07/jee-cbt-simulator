// Question Types
export type QuestionType = 'MCQ' | 'NUMERICAL';
export type Subject = 'PHYSICS' | 'CHEMISTRY' | 'MATHEMATICS';

export interface Option {
  id: string;
  text: string;
  latex?: string;
}

export interface Question {
  id: string;
  subject: Subject;
  type: QuestionType;
  number: number; // Question number 1-90
  question: string;
  questionLatex?: string;
  options?: Option[];
  correctAnswer: string | number; // option id for MCQ, value for NUMERICAL
  correctValue?: number; // For numerical questions
  tolerance?: number; // For numerical answer tolerance
  marks: number;
  negativeMarks: number;
  solution?: string;
  solutionLatex?: string;
}

export interface ExamConfig {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  duration: number; // in minutes
  totalMarks: number;
  questionsBySubject: Record<Subject, number>;
  sectionalTimeLimits?: Record<Subject, number>; // optional per-subject time limits
  createdAt: number;
}

export interface UserAnswer {
  questionId: string;
  answer?: string | number;
  markedForReview: boolean;
  visitedAt: number;
  answeredAt?: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examName: string;
  startedAt: number;
  endedAt?: number;
  answers: Record<string, UserAnswer>;
  currentQuestionIndex: number;
  currentSubject: Subject;
  totalTimeSpent: number; // in seconds
  isCompleted: boolean;
  submittedAt?: number;
}

export interface AnswerMetadata {
  questionId: string;
  subject: Subject;
  type: QuestionType;
  userAnswer?: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  markedForReview: boolean;
  timeSpent: number; // in seconds
  marks: number;
  negativeMarks: number;
  earnedMarks: number;
}

export interface ExamResult {
  id: string;
  attemptId: string;
  examId: string;
  examName: string;
  completedAt: number;
  totalTimeSpent: number;
  totalMarks: number;
  earnedMarks: number;
  accuracy: number; // percentage
  answerMetadata: AnswerMetadata[];
  subjectAnalysis: {
    [key in Subject]: {
      totalQuestions: number;
      attempted: number;
      correct: number;
      incorrect: number;
      markedForReview: number;
      totalMarks: number;
      earnedMarks: number;
      accuracy: number;
      timeSpent: number;
    };
  };
}

export interface AnalyticsData {
  examId: string;
  examName: string;
  attempts: number;
  averageMarks: number;
  bestScore: number;
  worstScore: number;
  averageAccuracy: number;
  averageTimePerQuestion: number;
  subjectPerformance: {
    [key in Subject]: {
      averageMarks: number;
      averageAccuracy: number;
      attemptCount: number;
    };
  };
}
