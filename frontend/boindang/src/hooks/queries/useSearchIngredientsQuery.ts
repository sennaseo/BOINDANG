import { useQuery } from '@tanstack/react-query';
import { searchIngredients } from '@/api/ingredients';
import type { IngredientSearchResponseData } from '@/types/api/ingredients';

interface UseSearchIngredientsQueryParams {
  query: string;
  suggested?: boolean;
  enabled?: boolean; // 쿼리 활성화 여부를 외부에서 제어하기 위함
}

// 쿼리 키 타입을 명시적으로 정의하여 TQueryKey 제네릭에 사용
// readonly와 const assertion (as const)을 사용하여 튜플의 타입과 순서를 고정합니다.
// [카테고리, 서브카테고리, ...동적 파라미터들]
type IngredientQueryKey = readonly [string, string, string, boolean | undefined];

/**
 * 성분 검색을 위한 TanStack Query 커스텀 훅 (v5 스타일)
 * @param query 검색할 키워드
 * @param suggested 오타 교정 여부 (기본값은 API 함수에서 처리)
 * @param enabled 쿼리 자동 실행 여부 (기본값: true, query가 있을 때만 활성화)
 * @returns TanStack Query의 useQuery 결과 (data, isLoading, isError, error 등)
 */
export const useSearchIngredientsQuery = ({
  query,
  suggested, // API 함수에서 기본값을 true로 설정했으므로, 여기서는 undefined일 수 있음
  enabled = true, // 이 훅을 사용하는 곳에서 명시적으로 false로 주지 않는 한, query 유무에 따라 결정
}: UseSearchIngredientsQueryParams) => {
  // 실제 쿼리 키 값 생성. `as const`를 사용하여 TypeScript가 리터럴 타입으로 추론하도록 함
  const queryKey: IngredientQueryKey = ['ingredients', 'search', query, suggested] as const;

  return useQuery<
    IngredientSearchResponseData, // TQueryFnData: queryFn이 반환하는 Promise가 resolve하는 데이터의 타입
    Error, // TError: queryFn이 reject하는 에러의 타입
    IngredientSearchResponseData, // TData: select 함수가 반환하는 데이터의 타입 (select 없으면 TQueryFnData와 동일)
    IngredientQueryKey // TQueryKey: queryKey의 타입 (위에서 정의한 타입)
  >({
    // 옵션 객체
    queryKey: queryKey,
    queryFn: () => searchIngredients({ query, suggested }),
    enabled: !!query && enabled, // query 문자열이 존재하고, 외부에서도 enabled가 true일 때만 쿼리 실행
    // 기타 TanStack Query 옵션들 (필요에 따라 추가):
    // staleTime: 1000 * 60 * 5, // 데이터가 5분 동안 fresh 상태 유지 (네트워크 요청 X)
    // cacheTime: 1000 * 60 * 10, // 10분 동안 캐시 유지 (비활성 시)
    // refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
  });
};