import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { deletePost } from '@/api/community';
// import { ApiResponseDeletePost } from '@/types/api/community'; // 삭제: 더 이상 사용하지 않음
import type { ApiResponse } from '@/types/api'; // ApiResponse<T>를 사용하기 위해 import

// TData: API 응답 타입 (ApiResponse<null>)
// TError: 에러 타입 (Error)
// TVariables: 뮤테이션 함수에 전달되는 변수 타입 (postId: number)
// TContext: onMutate에서 반환되는 컨텍스트 타입 (unknown)

export const useDeletePostMutation = (
  // 이 options는 useMutation의 options 객체와 병합됩니다.
  // TData, TError, TVariables, TContext 타입은 useMutation에 의해 추론될 수 있도록 합니다.
  customOptions?: UseMutationOptions<ApiResponse<null>, Error, number, unknown>
) => {
  const queryClient = useQueryClient();

  // 실제 API를 호출하는 뮤테이션 함수
  const mutationFunction = async (postId: number): Promise<ApiResponse<null>> => {
    // deletePost 함수는 이미 ApiResponse<null>을 반환하도록 수정되었음
    return deletePost(postId);
  };

  return useMutation<ApiResponse<null>, Error, number, unknown>({
    // mutationFn을 옵션 객체 내에 명시적으로 정의합니다.
    mutationFn: mutationFunction,
    onSuccess: (data: ApiResponse<null>, variables: number, context: unknown) => {
      // 성공 시 data 객체에는 상세 메시지가 없을 수 있지만, data.success로 성공 여부 판단 가능
      // deletePost API의 응답에 따라 data.message가 있을 수도 있고 없을 수도 있음.
      // 여기서는 성공 자체에 초점을 맞추고, 필요하다면 data.message를 로깅
      if (data.success) {
        console.log(`게시글(ID: ${variables}) 삭제 성공`);
      } else {
        // API 응답이 success: false 이지만 HTTP 에러는 아닌 경우 (예: 비즈니스 로직상 실패)
        console.warn(`게시글(ID: ${variables}) 삭제 처리 실패: ${data.error?.message}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['postDetail', variables] }); // variables는 postId

      if (customOptions?.onSuccess) {
        customOptions.onSuccess(data, variables, context);
      }
    },
    onError: (error: Error, variables: number, context: unknown) => {
      console.error(`게시글(ID: ${variables}) 삭제 중 에러 발생:`, error.message);
      if (customOptions?.onError) {
        customOptions.onError(error, variables, context);
      }
    },
    // 외부에서 전달받은 나머지 옵션들을 여기에 병합합니다.
    // customOptions에서 mutationFn은 이미 위에서 사용했으므로, 중복되지 않도록 주의가 필요할 수 있으나,
    // UseMutationOptions 타입 자체가 mutationFn을 포함할 수 있으므로 일반적으로는 문제되지 않습니다.
    ...customOptions,
  });
}; 