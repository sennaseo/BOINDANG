import apiClient from '@/lib/apiClient';

/**
 * OCR 분석 요청에 사용될 데이터의 타입 정의
 */
export interface OcrRequestPayload {
  ingredient_image_url: string;
  nutrition_image_url: string;
}

// OCR API 응답 타입 (현재는 /report 페이지에서 처리하므로, 구체적인 타입보다는 any 또는 void로 설정)
// 필요에 따라 백엔드에서 오는 실제 응답 구조로 구체화할 수 있습니다.
export interface OcrResponse {
  // 예시: success: boolean; data?: any; message?: string;
  // 우선은 간단하게 any로 두겠습니다.
  [key: string]: unknown;
}

/**
 * OCR 분석 API 요청 함수
 * @param ocrData 원재료명 이미지 URL과 영양 정보표 이미지 URL을 포함하는 객체
 * @returns Promise<OcrResponse> API 응답 전체 또는 처리된 데이터를 반환
 */
export const postOcrAnalysis = async (
  ocrData: OcrRequestPayload,
): Promise<OcrResponse> => {
  // apiClient를 사용하여 '/api/ocr/upload' 경로로 POST 요청을 보냅니다.
  // ocrData (이미지 URL들)도 함께 보냅니다.
  // 서버로부터 OcrResponse 형태의 응답을 기대합니다.
  // apiClient의 인터셉터에서 Authorization 헤더 등을 처리한다고 가정합니다.
  const response = await apiClient.post<OcrResponse>('/ocr/upload', ocrData);
  return response.data; // axios는 실제 응답 데이터를 'data' 프로퍼티에 담아줍니다.
}; 