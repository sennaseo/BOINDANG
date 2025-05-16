export interface QuizStatistics {
  totalSolved: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
}

export interface WrongAnswer {
  quizId: number;
  question: string;
  options: string[];
  isCorrect: boolean;
  answerId: number;
  selectedId: number;
  explanation: string;
  selectedExplanation: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  data: T;
}
