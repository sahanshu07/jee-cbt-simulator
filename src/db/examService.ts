import { db } from './schema';
import { ExamConfig, Question, ExamAttempt, ExamResult, AnswerMetadata, Subject } from '@/types';

export class ExamService {
  // Exam Management
  async saveExam(exam: ExamConfig, questions: Question[]): Promise<void> {
    await db.exams.put(exam);
    await db.questions.bulkPut(questions);
  }

  async getExam(examId: string): Promise<ExamConfig | undefined> {
    return db.exams.get(examId);
  }

  async getAllExams(): Promise<ExamConfig[]> {
    return db.exams.toArray();
  }

  async deleteExam(examId: string): Promise<void> {
    await db.exams.delete(examId);
    await db.questions.where('examId').equals(examId).delete();
  }

  // Questions
  async getQuestions(examId: string): Promise<Question[]> {
    const exam = await this.getExam(examId);
    if (!exam) return [];
    return db.questions.where('examId').equals(examId).toArray();
  }

  async getQuestionsBySubject(examId: string, subject: Subject): Promise<Question[]> {
    return db.questions.where('[examId+subject]').equals([examId, subject]).toArray();
  }

  // Attempts
  async saveAttempt(attempt: ExamAttempt): Promise<void> {
    await db.attempts.put(attempt);
  }

  async getAttempt(attemptId: string): Promise<ExamAttempt | undefined> {
    return db.attempts.get(attemptId);
  }

  async getAttemptsByExam(examId: string): Promise<ExamAttempt[]> {
    return db.attempts.where('examId').equals(examId).toArray();
  }

  async getAllAttempts(): Promise<ExamAttempt[]> {
    return db.attempts.toArray();
  }

  async deleteAttempt(attemptId: string): Promise<void> {
    await db.attempts.delete(attemptId);
  }

  // Results
  async saveResult(result: ExamResult): Promise<void> {
    await db.results.put(result);
  }

  async getResult(resultId: string): Promise<ExamResult | undefined> {
    return db.results.get(resultId);
  }

  async getResultsByExam(examId: string): Promise<ExamResult[]> {
    return db.results.where('examId').equals(examId).toArray();
  }

  async getAllResults(): Promise<ExamResult[]> {
    return db.results.toArray();
  }

  // Utilities
  async clearAllData(): Promise<void> {
    await db.exams.clear();
    await db.questions.clear();
    await db.attempts.clear();
    await db.results.clear();
  }
}

export const examService = new ExamService();
