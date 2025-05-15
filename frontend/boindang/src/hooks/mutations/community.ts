import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { deletePost } from '@/api/community';
import { ApiResponseDeletePost } from '@/types/api/community';

// TData: API 응답 타입 (ApiResponseDeletePost)
// TError: 에러 타입 (Error)
// TVariables: 뮤테이션 함수에 전달되는 변수 타입 (postId: number)
// TContext: onMutate에서 반환되는 컨텍스트 타입 (unknown)

export const useDeletePostMutation = (
  // 이 options는 useMutation의 options 객체와 병합됩니다.
  // TData, TError, TVariables, TContext 타입은 useMutation에 의해 추론될 수 있도록 합니다.
  customOptions?: UseMutationOptions<ApiResponseDeletePost, Error, number, unknown>
) => {
  const queryClient = useQueryClient();

  // 실제 API를 호출하는 뮤테이션 함수
  const mutationFunction = async (postId: number): Promise<ApiResponseDeletePost> => {
    return deletePost(postId);
  };

  return useMutation<ApiResponseDeletePost, Error, number, unknown>({
    // mutationFn을 옵션 객체 내에 명시적으로 정의합니다.
    mutationFn: mutationFunction,
    onSuccess: (data: ApiResponseDeletePost, variables: number, context: unknown) => {
      console.log('게시글 삭제 성공:', data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['postDetail', variables] });

      if (customOptions?.onSuccess) {
        customOptions.onSuccess(data, variables, context);
      }
    },
    onError: (error: Error, variables: number, context: unknown) => {
      console.error('게시글 삭제 실패:', error.message);
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