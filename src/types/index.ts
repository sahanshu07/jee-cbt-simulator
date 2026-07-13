export type Subject = 'PHYSICS' | 'CHEMISTRY' | 'MATHEMATICS';

export interface Question {
  id: string;
  number: number;
  subject: Subject;
  question: string;
  type: 'MCQ' | 'NUMERICAL';
  options?: Array<{ id: string; text: string }>;
  correctAnswer: string | number;
  marks: number;
  negativeMarks: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalMarks: number;
  questionsBySubject: Record<Subject, number>;
  createdAt: number;
}

export interface Answer {
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
  completedAt: number;
  answers: Record<string, Answer>;
  currentQuestionIndex: number;
  currentSubject: Subject;
  totalQuestions: number;
  totalMarks: number;
  correctAnswers: number;
  obtainedMarks: number;
}

export interface ExamConfig {
  totalQuestions: number;
  totalMarks: number;
  duration: number;
  negativeMarking: number;
}
