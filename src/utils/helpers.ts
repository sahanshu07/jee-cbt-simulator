import { Question, Subject } from '@/types';

export const generateQuestionId = (subject: Subject, number: number): string => {
  return `${subject}-${number}`;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const formatShortTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const secondsToTime = (seconds: number): { hours: number; minutes: number; seconds: number } => {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
};

export const calculateAccuracy = (correct: number, total: number): number => {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};

export const getSubjectColor = (subject: Subject): string => {
  const colors: Record<Subject, string> = {
    PHYSICS: '#ef4444',
    CHEMISTRY: '#3b82f6',
    MATHEMATICS: '#f59e0b',
  };
  return colors[subject];
};

export const getSubjectLabel = (subject: Subject): string => {
  return subject.charAt(0) + subject.slice(1).toLowerCase();
};

export const sortQuestionsByNumber = (questions: Question[]): Question[] => {
  return [...questions].sort((a, b) => a.number - b.number);
};

export const groupQuestionsBySubject = (questions: Question[]): Record<Subject, Question[]> => {
  const grouped: Record<Subject, Question[]> = {
    PHYSICS: [],
    CHEMISTRY: [],
    MATHEMATICS: [],
  };
  
  questions.forEach(q => {
    grouped[q.subject].push(q);
  });
  
  return grouped;
};

export const getQuestionsBySubject = (questions: Question[], subject: Subject): Question[] => {
  return questions.filter(q => q.subject === subject).sort((a, b) => a.number - b.number);
};

export const validateExamJSON = (data: any): { valid: boolean; error?: string } => {
  if (!data.name || typeof data.name !== 'string') {
    return { valid: false, error: 'Exam name is required' };
  }
  if (!data.duration || typeof data.duration !== 'number') {
    return { valid: false, error: 'Duration is required' };
  }
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    return { valid: false, error: 'Questions array is required' };
  }
  return { valid: true };
};
