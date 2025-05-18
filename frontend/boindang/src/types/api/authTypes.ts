// API가 실제로 받는 문자열 값들 (백엔드 명세 기준)
export type UserTypeApi = '다이어트' | '근성장' | '당뇨병' | '신장질환';
export type GenderApi = 'M' | 'F';

// 회원가입 요청 시 API 로 보내는 데이터의 모양
export interface SignUpRequestPayload {
  username: string;
  password: string;
  nickname: string;
  userType: UserTypeApi;
  gender: GenderApi;
  height: number; // 스토어에서는 string 이었지만, API는 number를 기대
  weight: number; // 스토어에서는 string 이었지만, API는 number를 기대
}

// 회원가입 성공 시 API 로부터 받는 응답 데이터 중 'result' 부분의 모양
export interface SignUpResult {
  id: number;
  username: string;
  nickname: string;
  userType: UserTypeApi; // API 응답이 이와 같다면, 아니면 string 등으로 조정
  gender: GenderApi;   // API 응답이 이와 같다면, 아니면 string 등으로 조정
  height: number;
  weight: number;
}

// API 에러 응답을 위한 공통 타입 (필요하다면 확장해서 사용)
export interface ApiErrorResponse {
  success?: boolean; // success가 false일 수 있음
  code?: number;
  message: string; // 에러 메시지
  errors?: Array<{ field: string; message: string }>; // 필드별 에러 상세 (백엔드가 제공한다면)
}

// 아이디 중복 확인 API 응답의 data 부분 타입
export type CheckUsernameData = boolean;

// 로그인 요청 시 API 로 보내는 데이터의 모양
export interface LoginRequestPayload {
  username: string;
  password: string;
}

// 로그인 성공 시 API 로부터 받는 응답 데이터 중 'result' 부분의 모양
export interface LoginResult {
  refreshToken: string;
  accessToken: string;
}

// 사용자 프로필 업데이트 API 요청 타입
export interface UserProfileUpdatePayload {
  userType?: UserTypeApi;
  height?: number;
  weight?: number;
}
