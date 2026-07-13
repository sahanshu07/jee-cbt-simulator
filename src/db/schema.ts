import Dexie, { Table } from 'dexie';
import { ExamConfig, Question, ExamAttempt, ExamResult } from '@/types';

export class JEESimulatorDB extends Dexie {
  exams!: Table<ExamConfig>;
  questions!: Table<Question>;
  attempts!: Table<ExamAttempt>;
  results!: Table<ExamResult>;

  constructor() {
    super('JEESimulator');
    this.version(1).stores({
      exams: '&id, createdAt',
      questions: '&id, subject, [examId+subject]',
      attempts: '&id, examId, startedAt',
      results: '&id, examId, completedAt',
    });
  }
}

export const db = new JEESimulatorDB();
