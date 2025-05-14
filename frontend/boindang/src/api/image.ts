import apiClient from '@/lib/apiClient';

/**
 * Pre-signed URL API 응답 전체 타입
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
 * @returns Promise<GetPresignedUrlResponse> API 응답 전체
 */
export const getPresignedUrl = async (
  fileType: string,
  fileName: string,
): Promise<GetPresignedUrlResponse> => {
  const response = await apiClient.get<GetPresignedUrlResponse>(
    `/image/presigned-url?fileType=${encodeURIComponent(fileType)}&fileName=${encodeURIComponent(fileName)}`
  );
  return response.data;
}; 