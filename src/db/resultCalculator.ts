import { ExamAttempt, Question, ExamResult, AnswerMetadata, Subject, UserAnswer } from '@/types';

export class ResultCalculator {
  static calculateResult(attempt: ExamAttempt, questions: Question[]): ExamResult {
    const now = Date.now();
    const questionMap = new Map(questions.map(q => [q.id, q]));
    const answerMetadata: AnswerMetadata[] = [];

    let totalEarnedMarks = 0;
    const subjectAnalysis: Record<Subject, any> = {
      PHYSICS: {
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        markedForReview: 0,
        totalMarks: 0,
        earnedMarks: 0,
        accuracy: 0,
        timeSpent: 0,
      },
      CHEMISTRY: {
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        markedForReview: 0,
        totalMarks: 0,
        earnedMarks: 0,
        accuracy: 0,
        timeSpent: 0,
      },
      MATHEMATICS: {
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        markedForReview: 0,
        totalMarks: 0,
        earnedMarks: 0,
        accuracy: 0,
        timeSpent: 0,
      },
    };

    questions.forEach(question => {
      const userAnswer = attempt.answers[question.id];
      const subject = question.subject;
      const analysis = subjectAnalysis[subject];

      analysis.totalQuestions++;
      analysis.totalMarks += question.marks;

      if (userAnswer?.markedForReview) {
        analysis.markedForReview++;
      }

      if (userAnswer?.answer !== undefined && userAnswer.answer !== '') {
        analysis.attempted++;

        const isCorrect = this.checkAnswer(question, userAnswer.answer);
        let earnedMarks = 0;

        if (isCorrect) {
          analysis.correct++;
          earnedMarks = question.marks;
        } else {
          analysis.incorrect++;
          earnedMarks = -question.negativeMarks;
        }

        analysis.earnedMarks += earnedMarks;
        totalEarnedMarks += earnedMarks;

        const timeSpent = userAnswer.answeredAt ? userAnswer.answeredAt - userAnswer.visitedAt : 0;
        analysis.timeSpent += timeSpent;

        answerMetadata.push({
          questionId: question.id,
          subject,
          type: question.type,
          userAnswer: userAnswer.answer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          markedForReview: userAnswer.markedForReview,
          timeSpent,
          marks: question.marks,
          negativeMarks: question.negativeMarks,
          earnedMarks,
        });
      }
    });

    // Calculate accuracy and percentages
    Object.keys(subjectAnalysis).forEach(subject => {
      const analysis = subjectAnalysis[subject as Subject];
      if (analysis.attempted > 0) {
        analysis.accuracy = (analysis.correct / analysis.attempted) * 100;
      }
    });

    const totalMarks = Object.values(subjectAnalysis).reduce((sum, s) => sum + s.totalMarks, 0);
    const accuracy = totalMarks > 0 ? (totalEarnedMarks / totalMarks) * 100 : 0;

    return {
      id: `result-${Date.now()}-${Math.random()}`,
      attemptId: attempt.id,
      examId: attempt.examId,
      examName: attempt.examName,
      completedAt: now,
      totalTimeSpent: attempt.totalTimeSpent,
      totalMarks,
      earnedMarks: Math.max(0, totalEarnedMarks),
      accuracy: Math.max(0, accuracy),
      answerMetadata,
      subjectAnalysis,
    };
  }

  private static checkAnswer(question: Question, userAnswer: string | number): boolean {
    if (question.type === 'MCQ') {
      return String(userAnswer) === String(question.correctAnswer);
    } else {
      const userNum = Number(userAnswer);
      const correctNum = question.correctValue ?? Number(question.correctAnswer);
      const tolerance = question.tolerance ?? 0;
      return Math.abs(userNum - correctNum) <= tolerance;
    }
  }
}
