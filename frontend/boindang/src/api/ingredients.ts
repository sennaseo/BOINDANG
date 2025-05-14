import apiClient from '@/lib/apiClient'; 
import type { 
  SearchPageApiResponse, 
  IngredientSearchResponseData,
  CategoryIngredientsApiResponse,
  IngredientResult
} from '@/types/api/ingredients';

interface SearchIngredientsParams {
  query: string;
  suggested?: boolean;
}

/**
 * 성분 키워드 검색 API 호출 함수
 * @param query 검색할 키워드
 * @param suggested 오타 교정 여부 (기본: true)
 * @returns 성분 검색 결과
 */
export const searchIngredients = async ({
  query,
  suggested = true,
}: SearchIngredientsParams): Promise<IngredientSearchResponseData> => {
  try {
    const response = await apiClient.get<SearchPageApiResponse>('/encyclopedia/search', {
      params: {
        query,
        suggested,
      },
    });

    // API 응답 구조에 따라 실제 데이터를 반환하도록 처리
    // isSuccess가 true이고 data가 존재할 경우 data를 반환, 그 외의 경우 에러 처리
    if (response.data.isSuccess && response.data.data) {
      return response.data.data;
    }
    // isSuccess가 false이거나 data가 없는 경우, API 메시지를 사용하여 에러 발생
    throw new Error(response.data.message || '성분 검색에 실패했습니다.');
  } catch (error) {
    // 네트워크 오류 또는 위에서 발생시킨 에러 처리
    console.error('Error searching ingredients:', error);
    // 실제 애플리케이션에서는 사용자에게 보여줄 에러 메시지를 여기서 결정하거나,
    // 에러 객체를 그대로 반환하여 호출부에서 처리하도록 할 수 있습니다.
    // 여기서는 간단히 Error 객체를 다시 throw 합니다.
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('알 수 없는 오류로 성분 검색에 실패했습니다.');
  }
};

interface FetchCategoryIngredientsParams {
  categoryName: string;
  // sort?: 'gi' | 'sweetness';
  // order?: 'asc' | 'desc';
  // size?: number;
}

/**
 * 특정 카테고리의 성분 목록을 가져오는 API 호출 함수
 * @param categoryName 조회할 성분 카테고리명
 * @returns 해당 카테고리의 성분 목록 (IngredientResult[])
 */
export const fetchCategoryIngredients = async ({
  categoryName,
}: FetchCategoryIngredientsParams): Promise<IngredientResult[]> => {
  try {
    const response = await apiClient.get<CategoryIngredientsApiResponse>('/encyclopedia/category', {
      params: {
        category: categoryName,
        // sort,
        // order,
        // size,
      },
    });

    if (response.data.isSuccess && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || '카테고리별 성분 목록을 가져오는데 실패했습니다.');
  } catch (error) {
    console.error(`Error fetching ingredients for category ${categoryName}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('알 수 없는 오류로 카테고리별 성분 목록을 가져오는데 실패했습니다.');
  }
};
