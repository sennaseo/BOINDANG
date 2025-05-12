import { useMutation } from '@tanstack/react-query';
import { postSignUp } from '@/api/auth';
import type {
  SignUpRequestPayload,
  SignUpResponse,
  ApiErrorResponse,
} from '@/types/api/authTypes';
import type { AxiosError } from 'axios';

// 회원가입 뮤테이션을 위한 커스텀 훅
export const useSignUp = () => {
  return useMutation<
    SignUpResponse,      // 뮤테이션 성공 시 반환될 데이터 타입
    AxiosError<ApiErrorResponse>, // 뮤테이션 실패 시 반환될 에러 타입
    SignUpRequestPayload // 뮤테이션 함수(mutate)에 전달될 변수의 타입
  >({
    mutationFn: postSignUp, // 실제로 API를 호출할 함수 (우리 항해사)

    // onSuccess, onError, onSettled 등의 콜백은 여기서 직접 정의하거나,
    // 이 훅을 사용하는 컴포넌트에서 mutate 함수의 두 번째 인자로 옵션을 전달하여 정의할 수 있습니다.

    // 예시: 훅 자체에 기본 콜백 설정
    // onSuccess: (data, variables, context) => {
    //   console.log('회원가입 성공 (useSignUp 훅):', data);
    //   // 예: alert('회원가입에 성공했습니다!');
    //   // 예: router.push('/login');
    // },
    // onError: (error, variables, context) => {
    //   console.error('회원가입 실패 (useSignUp 훅):', error.response?.data?.message || error.message);
    //   // 예: alert(`회원가입 실패: ${error.response?.data?.message || error.message}`);
    // },
  });
};