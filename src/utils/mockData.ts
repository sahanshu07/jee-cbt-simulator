const SAMPLE_QUESTIONS = [
  {
    id: 'phys-1',
    subject: 'PHYSICS',
    type: 'MCQ',
    number: 1,
    question: 'A particle moves in a circle of radius 5 m with a constant speed of 10 m/s. What is its centripetal acceleration?',
    options: [
      { id: 'a', text: '2 m/s²' },
      { id: 'b', text: '20 m/s²' },
      { id: 'c', text: '50 m/s²' },
      { id: 'd', text: '100 m/s²' },
    ],
    correctAnswer: 'b',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'phys-2',
    subject: 'PHYSICS',
    type: 'NUMERICAL',
    number: 2,
    question: 'If the velocity of a particle increases from 10 m/s to 20 m/s in 5 seconds, what is its acceleration?',
    correctValue: 2,
    tolerance: 0.1,
    marks: 4,
    negativeMarks: 0,
  },
  {
    id: 'chem-1',
    subject: 'CHEMISTRY',
    type: 'MCQ',
    number: 31,
    question: 'What is the atomic number of Carbon?',
    options: [
      { id: 'a', text: '4' },
      { id: 'b', text: '6' },
      { id: 'c', text: '8' },
      { id: 'd', text: '12' },
    ],
    correctAnswer: 'b',
    marks: 4,
    negativeMarks: 1,
  },
  {
    id: 'math-1',
    subject: 'MATHEMATICS',
    type: 'MCQ',
    number: 61,
    question: 'What is the derivative of x² + 3x + 2 with respect to x?',
    options: [
      { id: 'a', text: '2x + 3' },
      { id: 'b', text: 'x + 3' },
      { id: 'c', text: '2x + 2' },
      { id: 'd', text: 'x + 2' },
    ],
    correctAnswer: 'a',
    marks: 4,
    negativeMarks: 1,
  },
];

export const createSampleExam = () => {
  const exam = {
    id: `exam-${Date.now()}`,
    name: 'JEE Advanced - Mock Test 1',
    description: 'Full length mock test for JEE Advanced',
    totalQuestions: 90,
    duration: 150, // 2.5 hours
    totalMarks: 360,
    questionsBySubject: {
      PHYSICS: 30,
      CHEMISTRY: 30,
      MATHEMATICS: 30,
    },
    createdAt: Date.now(),
  };

  return { exam, questions: SAMPLE_QUESTIONS };
};

export const parseMockTestJSON = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    const exam = {
      id: `exam-${Date.now()}-${Math.random()}`,
      name: data.name || 'Imported Exam',
      description: data.description || '',
      totalQuestions: data.questions?.length || 0,
      duration: data.duration || 150,
      totalMarks: data.totalMarks || 360,
      questionsBySubject: data.questionsBySubject || {
        PHYSICS: 30,
        CHEMISTRY: 30,
        MATHEMATICS: 30,
      },
      createdAt: Date.now(),
    };

    const questions = (data.questions || []).map((q: any, index: number) => ({
      id: q.id || `q-${index}`,
      subject: q.subject || 'PHYSICS',
      type: q.type || 'MCQ',
      number: q.number || index + 1,
      question: q.question || '',
      questionLatex: q.questionLatex,
      options: q.options,
      correctAnswer: q.correctAnswer,
      correctValue: q.correctValue,
      tolerance: q.tolerance,
      marks: q.marks || 4,
      negativeMarks: q.negativeMarks || 1,
      solution: q.solution,
      solutionLatex: q.solutionLatex,
    }));

    return { exam, questions };
  } catch (error) {
    throw new Error(`Failed to parse exam JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
