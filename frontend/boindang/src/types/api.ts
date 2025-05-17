// API 응답 타입 전체 정의 

// 성공 응답
export interface ApiResponse<T> {
  data: T | null; // 성공 시 T 타입의 데이터, 실패 시 null
  error: ApiError | null; // 성공 시 null, 실패 시 ApiError 타입의 객체
  success: boolean; // true 또는 false
} 

// 실패 응답
export interface ApiError {
  status: string; // 예: "BAD_REQUEST", "UNAUTHORIZED", "NOT_FOUND", "INTERNAL_SERVER_ERROR" 등
  message: string;
}