export interface Quiz {
    quizId: number;
    title: string;
    question: string;
    options: string[];

  }
  
  export interface QuizAnswerResult {
    correct: boolean;
    answer: number;
    explanation: string;
  }
  
  export interface QuizSubmitRequest {
    quizId: number;
    selectedOptionId: number;
  }
  
  export interface QuizSubmitResponse {
    correct: boolean;
    answer: number;
    explanation: string;
  } 