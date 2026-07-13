export interface TimerState {
  totalSeconds: number;
  elapsedSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

export interface QuestionNavigationState {
  currentQuestionIndex: number;
  currentSubject: 'PHYSICS' | 'CHEMISTRY' | 'MATHEMATICS';
  totalQuestions: number;
  questionsBySubject: {
    [key: string]: number[];
  };
}

export interface QuestionPaletteStatus {
  questionId: string;
  answered: boolean;
  markedForReview: boolean;
  visited: boolean;
}
