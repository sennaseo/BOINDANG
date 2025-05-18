import apiClient from '@/lib/apiClient'; 
import type { 
  IngredientSearchResponseData,
  CategoryIngredientsData,
  IngredientDetailData,
} from '@/types/api/ingredients';
import type { ApiResponse, ApiError } from '@/types/api';
import axios from 'axios';

interface SearchIngredientsParams {
  query: string;
  suggested?: boolean;
}

/**
 * 성분 키워드 검색 API 호출 함수
 * @param query 검색할 키워드
 * @param suggested 오타 교정 여부 (기본: true)
 * @returns Promise<ApiResponse<IngredientSearchResponseData>> 성분 검색 API의 전체 응답
 */
export const searchIngredients = async ({
  query,
  suggested = true,
}: SearchIngredientsParams): Promise<ApiResponse<IngredientSearchResponseData>> => {
  try {
    const response = await apiClient.get<ApiResponse<IngredientSearchResponseData>>('/encyclopedia/search', {
      params: {
        query,
        suggested,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching ingredients:', error);
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && typeof error.response.data.success === 'boolean') {
        return error.response.data as ApiResponse<IngredientSearchResponseData>;
      }
      return {
        success: false,
        data: null,
        error: {
          status: error.response?.status?.toString() || 'AXIOS_ERROR',
          message: error.message || '성분 검색 중 Axios 오류 발생',
        },
      };
    } else if (error instanceof Error) {
      return {
        success: false,
        data: null,
        error: {
          status: 'CLIENT_ERROR',
          message: error.message || '알 수 없는 오류로 성분 검색에 실패했습니다.',
        },
      };
    }
    return {
      success: false,
      data: null,
      error: {
        status: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류로 성분 검색에 실패했습니다.',
      },
    };
  }
};

/**
 * 성분 상세 정보 조회 API 호출 함수
 * @param ingredientId 조회할 성분의 ID
 * @returns Promise<ApiResponse<IngredientDetailData>> 성분 상세 정보 API의 전체 응답
 */
export const getIngredientDetail = async (
  ingredientId: string
): Promise<ApiResponse<IngredientDetailData>> => {
  console.log('[getIngredientDetail] Called with ID:', ingredientId);
  console.log('[getIngredientDetail] apiClient baseURL:', apiClient.defaults.baseURL);
  try {
    const response = await apiClient.get<ApiResponse<IngredientDetailData>>(
      `/encyclopedia/ingredient/${ingredientId}`
    );
    console.log('[getIngredientDetail] Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error(`[getIngredientDetail] Error fetching ingredient detail for ID ${ingredientId}:`, error);
    // Axios 에러이고, 에러 응답이 있는 경우 해당 응답을 최대한 활용
    if (axios.isAxiosError(error) && error.response) {
      // 서버가 ApiResponse 형태로 에러를 내려준 경우 (success: false 등)
      if (error.response.data && typeof error.response.data.success === 'boolean') {
        return error.response.data as ApiResponse<IngredientDetailData>; 
      }
      // 그 외 Axios 에러 (예: 네트워크 오류는 아니지만 HTTP 상태 코드로 에러 표시)
      return {
        success: false,
        data: null,
        error: {
          status: String(error.response.status),
          message: (error.response.data as Record<string, unknown>)?.message as string || error.message || '성분 상세 정보 조회 중 Axios 오류 발생',
        },
      };
    } else if (error instanceof Error) { // 네트워크 오류 또는 요청 설정 오류 등 error.response가 없는 경우
      return {
        success: false,
        data: null,
        error: {
          status: 'CLIENT_ERROR',
          message: error.message || '성분 상세 정보 조회에 실패했습니다 (클라이언트 오류).',
        },
      };
    }
    // 모든 상황을 대비한 기본 에러 반환
    return {
      success: false,
      data: null,
      error: {
        status: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류로 성분 상세 정보 조회에 실패했습니다.',
      },
    };
  }
};

interface FetchCategoryIngredientsParams {
  categoryName: string;
  page?: number;
}

/**
 * 특정 카테고리의 성분 목록을 가져오는 API 호출 함수
 * @param categoryName 조회할 성분 카테고리명
 * @param page 페이지 번호
 * @returns Promise<ApiResponse<CategoryIngredientsData>> 해당 카테고리의 성분 목록과 총 페이지 수
 */
export const fetchCategoryIngredients = async ({
  categoryName,
  page,
}: FetchCategoryIngredientsParams): Promise<ApiResponse<CategoryIngredientsData>> => {
  try {
    const response = await apiClient.get<ApiResponse<CategoryIngredientsData>>('/encyclopedia/category', {
      params: {
        category: categoryName,
        page,
      },
    });

    const apiResult = response.data;

    if (apiResult.success && apiResult.data) {
      return { data: apiResult.data, error: null, success: true };
    } else {
      return {
        data: null,
        error: apiResult.error || {
          status: 'API_LOGIC_ERROR',
          message: '카테고리별 성분 목록을 가져오는데 실패했습니다 (API 응답 오류).',
        },
        success: false,
      };
    }
  } catch (error) {
    console.error(`Error fetching ingredients for category ${categoryName}:`, error);
    let apiError: ApiError;
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && typeof error.response.data.message === 'string' && typeof error.response.data.status === 'string') {
        apiError = { 
          status: error.response.data.status,
          message: error.response.data.message
        };
      } else if (error.response) {
        apiError = {
          status: String(error.response.status),
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
        message: '알 수 없는 오류로 카테고리별 성분 목록을 가져오는데 실패했습니다.' 
      };
    }
    return { data: null, error: apiError, success: false };
  }
};
