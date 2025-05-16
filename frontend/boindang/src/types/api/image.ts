/**
 * Pre-signed URL API 응답 데이터 타입
 */
export interface PresignedUrlData {
  fileKey: string;
  presignedUrl: string;
}

/**
 * Pre-signed URL API 응답 전체 타입
 * 기존 GetPresignedUrlResponse에서 data 필드의 타입을 명확히 하고,
 * 백엔드 응답 구조(success, data, error)를 따르도록 수정합니다.
 */
export interface ApiResponsePresignedUrl {
  success: boolean; // 실제 백엔드 응답에 맞춰 success, isSuccess 등으로 사용
  data: PresignedUrlData;
  error: string | null;
  // 필요에 따라 code, message 등 추가 필드 정의
}


/**
 * 이미지 메타데이터 업로드 요청 타입
 */
export interface ApiImageMetadataRequest {
  fileKey: string;
}

/**
 * 이미지 메타데이터 업로드 API 응답 데이터 타입
 */
export interface ApiImageMetadataResponseData {
  imageId: number;
  userId: number;
  imageUrl: string;
  createdAt: string;
  deletedAt: string | null;
}

// 에러 객체 타입을 위한 인터페이스
export interface ApiErrorObject {
  status: string; 
  message: string;
}

/**
 * 이미지 메타데이터 업로드 API 전체 응답 타입
 */
export interface ApiResponseImageMetadata {
  success: boolean;
  data: ApiImageMetadataResponseData | null;
  error: ApiErrorObject | null;
} 