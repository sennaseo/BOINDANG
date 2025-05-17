import apiClient from '@/lib/apiClient';
import type { PopularIngredient, PopularIngredientsApiResponse } from '@/types/api/encyclopedia';
import type { ApiResponse, ApiError } from '@/types/api'; // 공통 타입 임포트
import axios from 'axios';

/**
 * 실시간 인기 검색어 목록을 가져옵니다.
 * @param size 가져올 검색어 수 (기본값: 3)
 */
export const fetchPopularIngredients = async (size: number = 3): Promise<ApiResponse<PopularIngredient[]>> => {
  try {
    const response = await apiClient.get<PopularIngredientsApiResponse>('/encyclopedia/popular', {
      params: { size },
    });

    const apiResult = response.data; 

    if (apiResult.isSuccess && apiResult.data) {
      return { data: apiResult.data, error: null, success: true };
    } else {
      return { 
        data: null, 
        error: { 
          status: String(apiResult.code || 'API_LOGIC_ERROR'), 
          message: apiResult.message || '인기 검색어 정보를 가져오는데 실패했습니다.' 
        }, 
        success: false 
      };
    }
  } catch (error) {
    let apiError: ApiError;
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && typeof error.response.data.message === 'string' && typeof error.response.data.status === 'string') {
        apiError = { 
          status: error.response.data.status, // 백엔드가 제공하는 status 사용
          message: error.response.data.message // 백엔드가 제공하는 message 사용
        };
      } else if (error.response) {
        apiError = {
          status: String(error.response.status), // HTTP 상태 코드
          message: error.response.statusText || '서버에서 오류가 발생했습니다.'
        };
      } else if (error.request) {
        apiError = { 
          status: 'NETWORK_ERROR', 
          message: '서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.' 
        };
      } else {
        apiError = { 
          status: 'REQUEST_SETUP_ERROR', 
          message: `요청 설정 중 오류 발생: ${error.message}` 
        };
      }
    } else if (error instanceof Error) {
      apiError = { 
        status: 'UNKNOWN_CLIENT_ERROR', 
        message: error.message 
      };
    } else {
      apiError = { 
        status: 'UNKNOWN_ERROR', 
        message: '인기 검색어 API 요청 중 알 수 없는 오류가 발생했습니다.' 
      };
    }
    return { data: null, error: apiError, success: false };
  }
}; 