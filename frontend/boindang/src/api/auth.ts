import apiClient from '@/lib/apiClient';
import type {
  SignUpRequestPayload,
  CheckUsernameData,
  LoginRequestPayload,
  SignUpResult,
  LoginResult,
} from '@/types/api/authTypes';
import type { ApiResponse } from '@/types/api';

/**
 * 회원가입 API 요청 함수
 * @param userData 회원가입에 필요한 사용자 데이터 (SignUpRequestPayload 타입)
 * @returns Promise<ApiResponse<SignUpResult>> API 응답 전체를 반환 (공통 래퍼 적용)
 */
export const postSignUp = async (
  userData: SignUpRequestPayload
): Promise<ApiResponse<SignUpResult>> => {
  const response = await apiClient.post<ApiResponse<SignUpResult>>(
    '/user/signup',
    userData
  );
  return response.data;
}

/**
 * 아이디 중복 확인 API 요청 함수
 * @param username 확인할 아이디 (string)
 * @returns Promise<ApiResponse<CheckUsernameData>> API 응답 전체를 반환 (공통 래퍼 적용)
 */
export const getCheckUsername = async (
  username: string,
): Promise<ApiResponse<CheckUsernameData>> => {
  const response = await apiClient.get<ApiResponse<CheckUsernameData>>(
    `/user/check-username?username=${username}`,
  );
  return response.data;
};

/**
 * 로그인 API 요청 함수
 * @param loginData 로그인에 필요한 사용자 데이터 (LoginRequestPayload 타입)
 * @returns Promise<ApiResponse<LoginResult>> API 응답 전체를 반환 (공통 래퍼 적용)
 */
export const postLogin = async (
  loginData: LoginRequestPayload,
): Promise<ApiResponse<LoginResult>> => {
  const response = await apiClient.post<ApiResponse<LoginResult>>(
    '/user/login',
    loginData
  );
  return response.data;
};

export const getUserInfo = async (): Promise<SignUpResult> => {
  const response = await apiClient.get<SignUpResult>('/user/me');
  return response.data;
};

