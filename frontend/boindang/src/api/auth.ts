import apiClient from '@/lib/apiClient';
import type {
  SignUpRequestPayload,
  CheckUsernameData,
  LoginRequestPayload,
  SignUpResult,
  LoginResult,
  UserProfileUpdatePayload,
  LogoutResult,
  RefreshTokenResult,
} from '@/types/api/authTypes';
import type { ApiResponse } from '@/types/api';
import { useAuthStore } from '@/stores/authStore';

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
 * @returns Promise<ApiResponse<LogoutResult>> API 응답 전체를 반환
 */
export const getLogout = async (): Promise<ApiResponse<LogoutResult>> => {
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

/**
 * 토큰 재발급 API 요청 함수
 * @returns Promise<ApiResponse<RefreshTokenResult>> API 응답 전체를 반환
 */
export const postRefreshToken = async (): Promise<ApiResponse<RefreshTokenResult>> => {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    // 리프레시 토큰이 없으면 에러 처리 또는 특정 응답 반환
    // 이 경우, 로그인 페이지로 리다이렉트하는 로직이 필요할 수 있으나,
    // 여기서는 API 호출 함수의 역할에 집중하여 에러를 발생시키거나, success: false 응답을 모방하여 반환합니다.
    // 실제로는 인터셉터에서 이 함수를 호출하기 전에 리프레시 토큰 유무를 확인할 가능성이 높습니다.
    return Promise.resolve({
      data: null,
      error: {
        status: 'UNAUTHORIZED',
        message: '리프레시 토큰이 없습니다. 다시 로그인해주세요.',
      },
      success: false,
    });
  }

  // apiClient를 직접 사용하지 않고, 새로운 axios 인스턴스를 사용하거나
  // apiClient의 기본 설정을 임시로 변경하여 Authorization 헤더를 설정합니다.
  // 여기서는 apiClient.post를 사용하되, config에 헤더를 명시적으로 전달합니다.
  const response = await apiClient.get<ApiResponse<RefreshTokenResult>>(
    '/user/refresh',
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
  return response.data;
};
