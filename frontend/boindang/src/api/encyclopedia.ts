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

/**
 * 검색어 카운트를 증가시킵니다.
 * @param keyword 검색어
 */
export const increaseSearchCount = async (keyword: string): Promise<ApiResponse<string>> => {
  console.log('[increaseSearchCount] INVOKED, keyword:', keyword);
  try {
    // 요청 본문은 { request: keyword } 형태입니다. -> { request: keyword } 형태로 변경
    // -> URL 쿼리 파라미터로 request=keyword 전송, 바디는 빈 객체 {}
    const response = await apiClient.post<ApiResponse<string>>(
      '/encyclopedia/count', 
      {},
      { params: { request: keyword } }
    );
    console.log('[increaseSearchCount] apiClient.post call completed. Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('[increaseSearchCount] Error:', error);
    // 실제 에러 객체 구조에 따라 에러 메시지를 구성해야 할 수 있습니다.
    // 여기서는 간단히 에러를 다시 던지거나, 특정 형식의 ApiResponse를 반환할 수 있습니다.
    // 일단 요청 명세에 있는 실패 응답 구조와 유사하게 만들어 반환합니다.
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      data: null,
      error: {
        status: 'CLIENT_ERROR', // 실제 HTTP 상태 코드나 서버에서 오는 에러 코드로 대체 필요
        message: `Failed to increase search count for '${keyword}': ${errorMessage}`,
      },
      success: false,
    };
  }
}; 