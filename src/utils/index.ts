import { Question, Subject, Exam, ExamAttempt } from '@/types';

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
  const labels: Record<Subject, string> = {
    PHYSICS: 'Physics',
    CHEMISTRY: 'Chemistry',
    MATHEMATICS: 'Mathematics',
  };
  return labels[subject];
};

export const groupQuestionsBySubject = (
  questions: Question[]
): Record<Subject, Question[]> => {
  return questions.reduce(
    (acc, question) => {
      if (!acc[question.subject]) {
        acc[question.subject] = [];
      }
      acc[question.subject].push(question);
      return acc;
    },
    { PHYSICS: [], CHEMISTRY: [], MATHEMATICS: [] } as Record<Subject, Question[]>
  );
};

export const getQuestionsBySubject = (questions: Question[], subject: Subject): Question[] => {
  return questions.filter(q => q.subject === subject);
};

export const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export const calculateMarks = (correctAnswers: number, incorrectAnswers: number, marks: number, negativeMarks: number): number => {
  return correctAnswers * marks - incorrectAnswers * negativeMarks;
};

export const createSampleExam = (): { exam: Exam; questions: Question[] } => {
  const exam: Exam = {
    id: `exam-${Date.now()}`,
    name: 'JEE Main Mock Test #1',
    description: 'Full length mock test following JEE Main pattern',
    duration: 150,
    totalQuestions: 90,
    totalMarks: 300,
    questionsBySubject: {
      PHYSICS: 30,
      CHEMISTRY: 30,
      MATHEMATICS: 30,
    },
    createdAt: Date.now(),
  };

  const questions: Question[] = [
    ...generateSubjectQuestions('PHYSICS', 30, 1),
    ...generateSubjectQuestions('CHEMISTRY', 30, 31),
    ...generateSubjectQuestions('MATHEMATICS', 30, 61),
  ];

  return { exam, questions };
};

const generateSubjectQuestions = (subject: Subject, count: number, startNumber: number): Question[] => {
  const questions: Question[] = [];
  const questionTemplates = {
    PHYSICS: [
      'A particle moves with constant acceleration. If it covers 10m in 2s, what is its acceleration?',
      'A body of mass 2kg is thrown vertically upward with velocity 20m/s. What is the maximum height reached?',
      'Two resistors of 4Ω and 6Ω are connected in parallel. What is the equivalent resistance?',
      'A light ray incidents on a mirror at 30°. What is the angle of reflection?',
      'The wavelength of light is 500nm. What is its frequency?',
    ],
    CHEMISTRY: [
      'What is the atomic number of Calcium?',
      'Balance the equation: H₂ + O₂ → H₂O',
      'What is the molarity of a solution containing 5g of NaOH in 100mL of solution?',
      'Which gas has the highest ionization energy among halogens?',
      'What is the IUPAC name of CH₃-CH₂-CH₃?',
    ],
    MATHEMATICS: [
      'Find the derivative of f(x) = x³ + 2x² + x + 1',
      'Solve: 2x + 3 = 11',
      'Find the area of a circle with radius 5cm',
      'What is the sum of angles in a pentagon?',
      'Find the value of sin(30°)',
    ],
  };

  const templates = questionTemplates[subject];

  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const options = [
      { id: 'a', text: 'Option A' },
      { id: 'b', text: 'Option B' },
      { id: 'c', text: 'Option C' },
      { id: 'd', text: 'Option D' },
    ];

    questions.push({
      id: `q-${subject}-${i}`,
      number: startNumber + i,
      subject,
      question: `${template}`,
      type: 'MCQ',
      options,
      correctAnswer: options[Math.floor(Math.random() * 4)].id,
      marks: 4,
      negativeMarks: 1,
      explanation: 'This is the explanation for this question.',
    });
  }

  return questions;
};

export const parseMockTestJSON = (jsonString: string): { exam: Exam; questions: Question[] } => {
  try {
    const data = JSON.parse(jsonString);

    if (!data.name || !data.questions || !Array.isArray(data.questions)) {
      throw new Error('Invalid JSON format. Expected "name" and "questions" array.');
    }

    const exam: Exam = {
      id: `exam-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      duration: data.duration || 150,
      totalQuestions: data.questions.length,
      totalMarks: data.totalMarks || data.questions.length * 4,
      questionsBySubject: {
        PHYSICS: data.questions.filter((q: any) => q.subject === 'PHYSICS').length,
        CHEMISTRY: data.questions.filter((q: any) => q.subject === 'CHEMISTRY').length,
        MATHEMATICS: data.questions.filter((q: any) => q.subject === 'MATHEMATICS').length,
      },
      createdAt: Date.now(),
    };

    const questions: Question[] = data.questions.map((q: any, idx: number) => ({
      id: q.id || `q-${idx}`,
      number: idx + 1,
      subject: q.subject || 'PHYSICS',
      question: q.question,
      type: q.type || 'MCQ',
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks || 4,
      negativeMarks: q.negativeMarks || 1,
      explanation: q.explanation || '',
    }));

    return { exam, questions };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format. Please check your JSON syntax.');
    }
    throw error;
  }
};
