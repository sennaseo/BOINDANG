import apiClient from '@/lib/apiClient';
import type { PopularIngredient, PopularIngredientsApiResponse } from '@/types/api/encyclopedia';
import axios from 'axios';

/**
 * 실시간 인기 검색어 목록을 가져옵니다.
 * @param size 가져올 검색어 수 (기본값: 3)
 */
export const fetchPopularIngredients = async (size: number = 3): Promise<PopularIngredient[]> => {
  try {
    const response = await apiClient.get<PopularIngredientsApiResponse>('/encyclopedia/popular', {
      params: { size },
    });

    // Axios는 응답 데이터를 response.data에 담아줍니다.
    const result = response.data;

    if (result.isSuccess && result.data) {
      return result.data;
    } else {
      // HTTP 요청은 성공했으나, API 응답 자체에서 실패를 알리는 경우
      throw new Error(result.message || '인기 검색어 정보를 가져오는데 실패했습니다.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios 에러인 경우 (네트워크 오류, 서버 오류 등)
      if (error.response && error.response.data && typeof error.response.data.message === 'string') {
        // API가 반환한 에러 메시지가 있는 경우 사용
        throw new Error(error.response.data.message);
      } else if (error.request) {
        // 요청은 이루어졌으나 응답을 받지 못한 경우
        throw new Error('서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        // 요청 설정 중 발생한 에러
        throw new Error(`요청 설정 중 오류 발생: ${error.message}`);
      }
    } else if (error instanceof Error) {
      // Axios 에러가 아닌 다른 일반적인 JavaScript 에러
      throw error; // 기존 에러를 그대로 다시 throw
    }
    // 알 수 없는 타입의 에러
    throw new Error('인기 검색어 API 요청 중 알 수 없는 오류가 발생했습니다.');
  }
}; 