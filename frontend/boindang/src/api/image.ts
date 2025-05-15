import apiClient from '@/lib/apiClient';
import { 
  ApiResponsePresignedUrl, 
  ApiImageMetadataRequest, 
  ApiImageMetadataResponseData, 
  ApiResponseImageMetadata 
} from '@/types/api/image';
import { AxiosError } from 'axios';

/**
 * Pre-signed URL API 응답 전체 타입
 * @deprecated ApiResponsePresignedUrl 로 대체되었습니다.
 */
export interface GetPresignedUrlResponse {
  success: boolean;
  data: {
    fileKey: string;
    presignedUrl: string;
  };
  error: string | null;
}

/**
 * S3 업로드를 위한 Pre-signed URL 요청 API 함수
 * @param fileType 업로드할 파일의 MIME 타입 (예: 'image/jpeg', 'image/png')
 * @param fileName 업로드할 파일의 이름
 * @returns Promise<ApiResponsePresignedUrl> API 응답 전체 (수정된 타입)
 */
export const getPresignedUrl = async (
  fileType: string,
  fileName: string,
): Promise<ApiResponsePresignedUrl> => {
  const response = await apiClient.get<ApiResponsePresignedUrl>(
    `/image/presigned-url?fileType=${encodeURIComponent(fileType)}&fileName=${encodeURIComponent(fileName)}`
  );
  return response.data;
};

export const uploadImageToS3 = async (presignedUrl: string, file: File): Promise<boolean> => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type, // 실제 파일의 MIME 타입 사용
      },
      body: file,
    });
    return response.ok; // 2xx 상태 코드는 성공으로 간주
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return false;
  }
};

export const uploadImageMetadata = async (fileKey: string): Promise<ApiImageMetadataResponseData | null> => {
  try {
    const requestBody: ApiImageMetadataRequest = { fileKey };
    const response = await apiClient.post<ApiResponseImageMetadata>('/image/metadata', requestBody);

    // 수정된 타입에 맞춰 성공 여부 판단 및 data 반환
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      // 에러 메시지 우선순위: response.data.error 객체 내의 message, 그 다음 response.data.message (최상위), 기본 메시지
      const apiResponseData = response.data;
      let determinedErrorMessage = 'Unknown error during image metadata upload';
      if (apiResponseData) {
        const errorFromErrorObject = apiResponseData.error?.message;
        // ApiResponseImageMetadata 타입에 message 속성이 없다면, 아래와 같이 접근합니다.
        const topLevelMessage = (apiResponseData as { message?: string }).message;
        determinedErrorMessage = errorFromErrorObject || topLevelMessage || determinedErrorMessage;
      }
      const errorMessage = determinedErrorMessage;
      console.error('Failed to upload image metadata or invalid response:', errorMessage, response.data);
      return null;
    }
  } catch (e) {
    const error = e as AxiosError;
    // Axios 에러 객체에서 실제 백엔드가 보낸 에러 내용 확인 시도
    let determinedBackendErrorMessage = error.message; // Default to Axios error message
    if (error.response?.data && typeof error.response.data === 'object') {
      const errorResponseData = error.response.data as Partial<{ error: { message: string }, message: string }>; // 타입 단언 구체화
      determinedBackendErrorMessage = errorResponseData.error?.message || errorResponseData.message || determinedBackendErrorMessage;
    }
    const backendErrorMessage = determinedBackendErrorMessage;
    console.error('Error in uploadImageMetadata catch block:', backendErrorMessage, error.response?.data || error);
    return null;
  }
}; 