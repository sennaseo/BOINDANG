import apiClient from '@/lib/apiClient';
import type { ApiResponse, QuizStatistics, WrongAnswer } from '@/types/api/more/quiz';

export const fetchQuizStatistics = async (): Promise<QuizStatistics> => {
  const response = await apiClient.get<ApiResponse<QuizStatistics>>('/quiz/statistics');
  return response.data.data;
};

export const fetchWrongAnswers = async (): Promise<WrongAnswer[]> => {
  const response = await apiClient.get<ApiResponse<WrongAnswer[]>>('/quiz/wrong-answers');
  return response.data.data;
};
