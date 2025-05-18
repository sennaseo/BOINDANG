import apiClient from '@/lib/apiClient';
import type {
  SignUpRequestPayload,
  CheckUsernameData,
  LoginRequestPayload,
  SignUpResult,
  LoginResult,
  UserProfileUpdatePayload,
  LogoutResult,
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


/**
 * 사용자 정보 조회 API 요청 함수
 * @returns Promise<SignUpResponse> API 응답 전체를 반환
 * 회원가입 후 회원 정보 조회 시 사용
 */
export const getUserInfo = async (): Promise<ApiResponse<SignUpResult>> => {
  const response = await apiClient.get<ApiResponse<SignUpResult>>('/user/me');
  return response.data;
};

/**
 * 사용자 프로필 정보 업데이트 API 요청 함수
 * @param profileData 업데이트할 프로필 데이터 (UserProfileUpdatePayload 타입)
 * @returns Promise<SignUpResponse> API 응답 전체를 반환 (성공 시 업데이트된 사용자 정보 포함)
 */
export const updateUserProfile = async (
  profileData: UserProfileUpdatePayload
): Promise<ApiResponse<UserProfileUpdatePayload>> => {
  // apiClient를 사용하여 '/user/profile' 또는 해당하는 엔드포인트로 PUT 또는 PATCH 요청
  // 여기서는 PUT '/user/me' (기존 getUserInfo와 유사한 엔드포인트 가정) 또는 '/user/profile' 등을 사용할 수 있습니다.
  // 백엔드 API 명세에 따라 엔드포인트와 HTTP 메소드를 결정해야 합니다.
  // 일반적인 RESTful API에서는 PATCH /user/me 또는 PUT /user/profile 등을 사용합니다.
  const response = await apiClient.patch<ApiResponse<UserProfileUpdatePayload>>('/user/me', profileData); // 예시로 PATCH 사용
  return response.data;
};

/**
 * 로그아웃 API 요청 함수
 * @returns Promise<ApiResponse<void>> API 응답 전체를 반환 (공통 래퍼 적용)
 */
export const postLogout = async (): Promise<ApiResponse<LogoutResult>> => {
  const response = await apiClient.get<ApiResponse<LogoutResult>>('/user/logout');
  return response.data;
};

/**
 * 회원탈퇴 API 요청 함수
 * @returns Promise<ApiResponse<void>> API 응답 전체를 반환 (공통 래퍼 적용)
 */
export const postDeleteAccount = async (): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>('/user/delete');
  return response.data;
};
