import apiClient from '@/lib/apiClient';
import type { PopularIngredient } from '@/types/api/encyclopedia';
import type { ApiResponse } from '@/types/api';

/**
 * 실시간 인기 검색어 목록을 가져옵니다.
 * @param size 가져올 검색어 수 (기본값: 3)
 */
export const fetchPopularIngredients = async (size: number = 3): Promise<ApiResponse<PopularIngredient[]>> => {
  console.log('[fetchPopularIngredients] INVOKED, size:', size);
  console.log('[fetchPopularIngredients] About to call apiClient.get for /encyclopedia/popular');
  
  // apiClient.get이 반환하는 것은 AxiosResponse<ApiResponse<PopularIngredient[]>> 입니다.
  // 인터셉터에서 최종적으로 반환하는 것은 이 response.data (즉, ApiResponse<PopularIngredient[]>) 또는 에러입니다.
  const response = await apiClient.get<ApiResponse<PopularIngredient[]>>('/encyclopedia/popular', {
    params: { size },
  });
  
  console.log('[fetchPopularIngredients] apiClient.get call completed. Response data:', response.data);
  // 성공/실패 여부는 response.data (ApiResponse) 내부의 success 필드로 판단.
  // page.tsx에서 이 값을 보고 처리합니다.
  return response.data; 
}; 