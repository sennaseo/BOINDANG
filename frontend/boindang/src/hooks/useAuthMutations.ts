import { useMutation } from '@tanstack/react-query';
import { postSignUp, getCheckUsername, postLogin } from '@/api/auth';
import type {
  SignUpRequestPayload,
  ApiErrorResponse,
  LoginRequestPayload,
  SignUpResult,
  CheckUsernameData,
  LoginResult as AuthLoginResult
} from '@/types/api/authTypes';
import type { ApiResponse } from '@/types/api';
import type { AxiosError } from 'axios';

// 회원가입 뮤테이션을 위한 커스텀 훅
export const useSignUp = () => {
  return useMutation<
    ApiResponse<SignUpResult>,
    AxiosError<ApiErrorResponse>,
    SignUpRequestPayload
  >({
    mutationFn: postSignUp,

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

// 아이디 중복 확인 뮤테이션을 위한 커스텀 훅
export const useCheckUsername = () => {
  return useMutation<
    ApiResponse<CheckUsernameData>,
    AxiosError<ApiErrorResponse>,
    string
  >({
    mutationFn: getCheckUsername,

    // 에러 처리 예시 (useSignUp 훅과 유사하게)
    onError: (error) => {
      console.error('아이디 중복 확인 실패:', error.response?.data?.message || error.message);
      // 여기서 UI 피드백을 위한 상태 업데이트 등을 고려할 수 있습니다.
      // 예를 들어, error.response?.data?.message 를 에러 상태에 저장
    },
    // 성공 시 특별한 처리가 필요하면 onSuccess 콜백 추가 가능
    // onSuccess: (data, variables, context) => {
    //   console.log('아이디 사용 가능 여부:', data.result);
    // }
  });
};

// 로그인 뮤테이션을 위한 커스텀 훅
export const useLogin = () => {
  return useMutation<
    ApiResponse<AuthLoginResult>,
    AxiosError<ApiErrorResponse>,
    LoginRequestPayload
  >({
    mutationFn: postLogin,

    // 에러 처리 예시 (다른 훅들과 유사하게)
    onError: (error) => {
      console.error('로그인 실패:', error.response?.data?.message || error.message);
      // 여기서 UI 피드백을 위한 로직을 추가할 수 있습니다.
      // 예를 들어, 로그인 페이지의 에러 상태에 메시지를 설정
    },
    // 성공 시 토큰 저장 등의 로직을 여기에 추가하거나,
    // 컴포넌트에서 mutate의 onSuccess 콜백으로 처리할 수 있습니다.
    // onSuccess: (data, variables, context) => {
    //   console.log('로그인 성공, 토큰:', data.result.accessToken);
    //   // 예: localStorage 또는 상태 관리 라이브러리에 토큰 저장
    // }
  });
};