import apiClient from '../lib/apiClient';
import { Quiz, QuizSubmitRequest, QuizAnswerResult } from '../types/api/quiz';

// 퀴즈 5문제 출제
export async function fetchQuizList(): Promise<Quiz[]> {
  const res = await apiClient.get('/quiz');
  console.log('quiz:', res.data.data);
  return res.data.data;
}

// 정답 제출
export async function submitQuizAnswer(quizId: number, selectedOptionId: number): Promise<QuizAnswerResult> {
  console.log('POST 요청 body:', { quizId, selectedOptionId });
  const res = await apiClient.post('/quiz/submit', { quizId, selectedOptionId } as QuizSubmitRequest);
  console.log('submitQuizAnswer API 응답:', res.data);
  const data = res.data.data;
  return {
    correct: data.isCorrect,
    answer: data.answer,
    explanation: data.explanation,
  };
}
