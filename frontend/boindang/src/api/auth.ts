import apiClient from '@/lib/apiClient';
import type {
  SignUpRequestPayload,
  SignUpResponse,
  CheckUsernameResponse,
  LoginRequestPayload,
  LoginResponse,
  UserProfileUpdatePayload,
} from '@/types/api/authTypes';

/**
 * 회원가입 API 요청 함수
 * @param userData 회원가입에 필요한 사용자 데이터 (SignUpRequestPayload 타입)
 * @returns Promise<SignUpResponse> API 응답 전체를 반환
 */

export const postSignUp = async (userData: SignUpRequestPayload) : Promise<SignUpResponse> => {
  // apiClient (우리 배)를 사용해서 '/signup' 경로로 POST 요청을 보냅니다.
  // userData (화물)도 함께 보냅니다.
  // 서버로부터 SignUpResponse 형태의 응답을 기대합니다.
  const response = await apiClient.post<SignUpResponse>('/user/signup', userData);
  return response.data; // axios는 실제 응답 데이터를 'data' 속에 담아줍니다.
}


/**
 * 아이디 중복 확인 API 요청 함수
 * @param username 확인할 아이디 (string)
 * @returns Promise<CheckUsernameResponse> API 응답 전체를 반환
 */
export const getCheckUsername = async (
  username: string,
): Promise<CheckUsernameResponse> => {
  // apiClient를 사용해서 '/user/check-username' 경로로 GET 요청을 보냅니다.
  // query parameter로 username을 전달합니다.
  const response = await apiClient.get<CheckUsernameResponse>(
    `/user/check-username?username=${username}`,
  );
  return response.data; // 응답 데이터를 반환합니다.
};

/**
 * 로그인 API 요청 함수
 * @param loginData 로그인에 필요한 사용자 데이터 (LoginRequestPayload 타입)
 * @returns Promise<LoginResponse> API 응답 전체를 반환
 */
export const postLogin = async (
  loginData: LoginRequestPayload,
): Promise<LoginResponse> => {
  // apiClient (우리 배)를 사용해서 '/user/login' 경로로 POST 요청을 보냅니다.
  // loginData (아이디, 비밀번호)도 함께 보냅니다.
  // 서버로부터 LoginResponse 형태의 응답을 기대합니다.
  const response = await apiClient.post<LoginResponse>('/user/login', loginData);
  return response.data; // axios는 실제 응답 데이터를 'data' 속에 담아줍니다.
};


/**
 * 사용자 정보 조회 API 요청 함수
 * @returns Promise<SignUpResponse> API 응답 전체를 반환
 * 회원가입 후 회원 정보 조회 시 사용
 */
export const getUserInfo = async (): Promise<SignUpResponse> => {
  const response = await apiClient.get<SignUpResponse>('/user/me');
  return response.data;
};

/**
 * 사용자 프로필 정보 업데이트 API 요청 함수
 * @param profileData 업데이트할 프로필 데이터 (UserProfileUpdatePayload 타입)
 * @returns Promise<SignUpResponse> API 응답 전체를 반환 (성공 시 업데이트된 사용자 정보 포함)
 */
export const updateUserProfile = async (
  profileData: UserProfileUpdatePayload
): Promise<SignUpResponse> => {
  // apiClient를 사용하여 '/user/profile' 또는 해당하는 엔드포인트로 PUT 또는 PATCH 요청
  // 여기서는 PUT '/user/me' (기존 getUserInfo와 유사한 엔드포인트 가정) 또는 '/user/profile' 등을 사용할 수 있습니다.
  // 백엔드 API 명세에 따라 엔드포인트와 HTTP 메소드를 결정해야 합니다.
  // 일반적인 RESTful API에서는 PATCH /user/me 또는 PUT /user/profile 등을 사용합니다.
  const response = await apiClient.patch<SignUpResponse>('/user/me', profileData); // 예시로 PATCH 사용
  return response.data;
};
