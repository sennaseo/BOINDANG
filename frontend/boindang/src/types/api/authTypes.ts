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

// 회원가입 성공 시 API 로부터 받는 전체 응답 데이터의 모양
export interface SignUpResponse {
  success: boolean;
  code: number;
  message: string;
  result: SignUpResult | null; // 성공 시 result 객체, 실패 시 null 또는 없을 수 있음
}

// API 에러 응답을 위한 공통 타입 (필요하다면 확장해서 사용)
export interface ApiErrorResponse {
  success?: boolean; // success가 false일 수 있음
  code?: number;
  message: string; // 에러 메시지
  errors?: Array<{ field: string; message: string }>; // 필드별 에러 상세 (백엔드가 제공한다면)
}

// 아이디 중복 확인 성공 시 API 로부터 받는 전체 응답 데이터의 모양
export interface CheckUsernameResponse {
  success : boolean;
  code : number;
  message : string;
  result : boolean; // true : 중복, false : 사용 가능
}

// 로그인 요청 시 API 로 보내는 데이터의 모양
export interface LoginRequestPayload {
  username: string; // 로그인 페이지의 state가 username을 사용하므로 username으로 정의
  password: string;
}

// 로그인 성공 시 API 로부터 받는 응답 데이터 중 'result' 부분의 모양
export interface LoginResult {
  refreshToken: string;
  accessToken: string;
  // 명세 이미지의 표에는 userId도 있었지만, JSON 예시에는 없으므로 일단 토큰만 포함
  // 필요하다면 userId: number; 추가 가능
}

// 로그인 성공 시 API 로부터 받는 전체 응답 데이터의 모양
export interface LoginResponse {
  success: boolean;
  code: number;
  message: string;
  result: LoginResult; // 로그인 성공 시 토큰 정보 포함
}

// --- 사용자 프로필 업데이트 추가 ---
// 사용자 프로필 업데이트 시 API로 보내는 데이터 타입
export interface UserProfileUpdatePayload {
  nickname?: string;
  userType?: UserTypeApi;
  height?: number;
  weight?: number;
  gender?: GenderApi;
}
// --- 사용자 프로필 업데이트 끝 ---

// 로그인 실패 시 API 응답은 기존 ApiErrorResponse 타입으로 처리 가능할 것으로 보입니다.
// ApiErrorResponse: { success?: boolean; code?: number; message: string; errors?: ... }
// 명세 이미지의 401 예시: { isSuccess: false, code: 401, message: "..." }
// 'isSuccess' 키 이름이 다르지만, success?: boolean 으로 커버 가능합니다.
