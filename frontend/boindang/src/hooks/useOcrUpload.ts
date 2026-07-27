import { useCallback, useState } from 'react';
import type { useRouter } from 'next/navigation';
import { postOcrAnalysis } from '@/api/ocr';
import { getPresignedUrl } from '@/api/image';
import { CDN_BASE_URL } from '@/lib/constants';
import { ApiResponse } from '@/types/api';
import { OcrResponseData } from '@/types/api/ocrCameraTypes';
import { getApiErrorMessage } from '@/lib/getApiErrorMessage';

// Base64 문자열을 Blob 객체로 변환하는 헬퍼 함수
async function base64ToBlob(base64: string, fileType: string): Promise<Blob> {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: fileType });
}

// 이미지를 S3에 업로드하고 CloudFront URL을 반환하는 함수
async function uploadImageAndGetCloudFrontUrl(base64Data: string, fileType: string, fileName: string): Promise<string> {
  if (!base64Data.startsWith('data:')) {
    console.warn('uploadImageAndGetCloudFrontUrl: base64Data가 data URI 형식이 아닙니다. 그대로 반환 시도:', base64Data.substring(0, 100));
    throw new Error('잘못된 형식의 이미지 데이터입니다 (Data URI 필요).');
  }

  // 1. Pre-signed URL 요청
  const presignedUrlResponse = await getPresignedUrl(fileType, fileName);
  console.log('[OCR Camera] Received presignedUrlResponse:', JSON.stringify(presignedUrlResponse, null, 2));

  // presignedUrlResponse.data가 존재하고, 그 안의 presignedUrl이 유효한 문자열인지 확인
  if (!presignedUrlResponse.success || !presignedUrlResponse.data || typeof presignedUrlResponse.data.presignedUrl !== 'string') {
    console.error('[OCR Camera] Failed to get valid pre-signed URL data. Response:', presignedUrlResponse);
    throw new Error(presignedUrlResponse.error || 'Pre-signed URL을 받아오는데 실패했습니다 (데이터가 없거나 presignedUrl이 유효하지 않음).');
  }
  // s3PresignedUrl에는 실제 S3 업로드 URL을 할당
  const s3PresignedUrl = presignedUrlResponse.data.presignedUrl;
  // objectKey는 API 응답에서 직접 가져옴
  const objectKey = presignedUrlResponse.data.fileKey;

  console.log('[OCR Camera] Using S3 Pre-signed URL for fetch:', s3PresignedUrl);
  console.log('[OCR Camera] Using Object Key for CloudFront URL:', objectKey);

  // 2. Base64를 Blob으로 변환
  const imageBlob = await base64ToBlob(base64Data, fileType);

  // 3. S3로 직접 업로드 (PUT 요청)
  const uploadResponse = await fetch(s3PresignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
    },
    body: imageBlob,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error('S3 업로드 실패 응답:', errorText);
    throw new Error(`이미지 업로드에 실패했습니다 (S3). 상태: ${uploadResponse.status}`);
  }

  // 4. CloudFront URL 구성 (API 응답에서 받은 fileKey를 사용)
  const cloudFrontUrl = `${CDN_BASE_URL}/${objectKey}`;

  console.log(`이미지 업로드 성공: ${cloudFrontUrl}`);
  return cloudFrontUrl;
}

type AppRouter = ReturnType<typeof useRouter>;

interface UseOcrUploadParams {
  router: AppRouter;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  resetToIngredientStep: () => void;
}

interface UseOcrUploadResult {
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  processAndNavigate: (
    ingredientPhoto: string | null,
    nutritionPhoto: string | null,
  ) => Promise<void>;
}

/**
 * presigned URL 발급 → S3 업로드 → CloudFront URL 구성 → OCR API 호출 →
 * 결과 검증 → localStorage/BroadcastChannel 상태 전파를 담당하는 훅.
 */
export function useOcrUpload({ router, setError, resetToIngredientStep }: UseOcrUploadParams): UseOcrUploadResult {
  const [isProcessing, setIsProcessing] = useState(false);

  const processAndNavigate = useCallback(
    async (ingredientPhoto: string | null, nutritionPhoto: string | null) => {
      console.log('[ProcessAndNavigate] Function START. Current state:', { ingredientPhoto, nutritionPhoto });

      const currentIngredientPhotoBase64 = ingredientPhoto;
      const finalNutritionPhotoBase64 = nutritionPhoto;

      if (!currentIngredientPhotoBase64 || !finalNutritionPhotoBase64) {
        const errMessage = '원재료 및 영양 정보 사진이 모두 필요합니다.';
        setError(errMessage);
        console.error('[ProcessAndNavigate] Missing photos. Setting state to error.');
        localStorage.setItem('ocrAnalysisState', 'error');
        localStorage.setItem('ocrAnalysisMessage', errMessage);
        localStorage.removeItem('ocrResultId');
        localStorage.removeItem('ocrUserNavigatedHome');

        resetToIngredientStep();
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);
      setError(null);
      // 분석 시작 시 processing 상태로 설정
      console.log('[ProcessAndNavigate] Setting localStorage to PROCESSING.');
      localStorage.setItem('ocrAnalysisState', 'processing');
      localStorage.setItem('ocrAnalysisMessage', '성분 분석을 위해 이미지를 처리 중입니다...');
      localStorage.removeItem('ocrResultId'); // 이전 결과 ID 제거
      localStorage.removeItem('ocrResultIdForToast'); // 관련 플래그 정리

      try {
        const ingredientFileType = 'image/jpeg';
        const nutritionFileType = 'image/jpeg';
        const ingredientFileName = `ingredient-${Date.now()}.jpg`;
        const nutritionFileName = `nutrition-${Date.now() + 1}.jpg`;

        console.log('원재료 이미지 업로드 시작...');
        // currentIngredientPhotoBase64와 finalNutritionPhotoBase64는 위의 null 체크로 인해 string임이 보장됨
        const ingredientCloudFrontUrl = await uploadImageAndGetCloudFrontUrl(currentIngredientPhotoBase64, ingredientFileType, ingredientFileName);

        console.log('영양정보 이미지 업로드 시작...');
        const nutritionCloudFrontUrl = await uploadImageAndGetCloudFrontUrl(finalNutritionPhotoBase64, nutritionFileType, nutritionFileName);

        const requestBody = {
          ingredient_image_url: ingredientCloudFrontUrl,
          nutrition_image_url: nutritionCloudFrontUrl,
        };

        console.log('OCR API 요청 (CloudFront URLs):', requestBody);
        console.log('[ProcessAndNavigate] Attempting to call postOcrAnalysis.');
        const ocrResponse: ApiResponse<OcrResponseData> = await postOcrAnalysis(requestBody);
        console.log('[ProcessAndNavigate] postOcrAnalysis call FINISHED. Response:', ocrResponse);

        // 1. API 요청 성공 여부 먼저 확인
        if (!ocrResponse.success) {
          console.warn('OCR API 요청 실패:', ocrResponse.error);
          const errorMessage = ocrResponse.error?.message || 'OCR 분석 중 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          setError(errorMessage);
          // 에러 발생 시 localStorage 상태 업데이트
          console.warn('[ProcessAndNavigate] OCR API call FAILED. Setting localStorage to ERROR.', ocrResponse.error);
          localStorage.setItem('ocrAnalysisState', 'error');
          localStorage.setItem('ocrAnalysisMessage', errorMessage);
          localStorage.removeItem('ocrResultId');

          // BroadcastChannel로 상태 변경 알림 (에러)
          const errorChannel = new BroadcastChannel('ocr_status_channel');
          errorChannel.postMessage({
            status: 'error',
            message: errorMessage,
            resultId: null,
          });
          errorChannel.close();

          return; // finally로 이동하여 setIsProcessing(false) 등을 처리
        }

        // 2. success 이고 data가 있는 경우 productId 확인
        const responseData = ocrResponse.data;
        if (!responseData) {
          console.warn('OCR API 응답 데이터가 없습니다. (success: true, data: null)');
          const errorMessage = '분석 결과를 받았지만, 내용이 비어있습니다. 다른 사진으로 시도해주세요.';
          setError(errorMessage);
          console.warn('[ProcessAndNavigate] OCR response data is NULL. Setting localStorage to ERROR.');
          localStorage.setItem('ocrAnalysisState', 'error');
          localStorage.setItem('ocrAnalysisMessage', errorMessage);
          localStorage.removeItem('ocrResultId');

          // BroadcastChannel로 상태 변경 알림 (에러)
          const errorChannel = new BroadcastChannel('ocr_status_channel');
          errorChannel.postMessage({
            status: 'error',
            message: errorMessage,
            resultId: null,
          });
          errorChannel.close();

          return; // finally로 이동
        }

        const productId = responseData.productId;
        console.log('productId:', productId);

        if (productId) {
          // 1. "Unknown Product" 조기 차단
          if (responseData.productName === 'Unknown Product') {
            console.warn("[Validation Fail] productName이 'Unknown Product'입니다. productId:", productId);
            const errorMessage = '제품 정보를 명확히 인식할 수 없습니다.\n사진을 다시 촬영해주세요.';
            setError(errorMessage);
            console.warn("[ProcessAndNavigate] Product name is 'Unknown Product'. Setting localStorage to ERROR.");
            localStorage.setItem('ocrAnalysisState', 'error');
            localStorage.setItem('ocrAnalysisMessage', errorMessage);
            localStorage.removeItem('ocrResultId');

            // BroadcastChannel로 상태 변경 알림 (에러)
            const errorChannel = new BroadcastChannel('ocr_status_channel');
            errorChannel.postMessage({
              status: 'error',
              message: errorMessage,
              resultId: null,
            });
            errorChannel.close();

            return; // finally로 이동
          }

          const resultData = responseData.result;
          let isValidResponse = false;
          let hasMeaningfulIngredientAnalysis = false;
          let hasMeaningfulNutritionAnalysis = false;
          let isExplicitlyInvalidSummary = false; // 명시적 실패 summary 플래그

          if (resultData) {
            const ia = resultData.ingredientAnalysis;
            const na = resultData.nutritionAnalysis;

            console.log('[Debug] Ingredient Analysis for validation:', ia);
            console.log('[Debug] Nutrition Analysis for validation:', na);

            const knownNegativeSummaries = [
              '정보가 없어', '분석이 불가능합니다', '제공되지 않은 제품입니다', '분석할 수 없습니다',
              '인식할 수 없습니다',
              '전자제품', '비식품', // 부정 키워드 추가
              '성분이 아닌', '영양 정보가 없는', // 스크린샷의 메시지 기반 추가
            ];

            // Ingredient Analysis Summary 검사
            if (ia && typeof ia.summary === 'string' && ia.summary.trim() !== '') {
              const lowerCaseSummary = ia.summary.toLowerCase();
              if (knownNegativeSummaries.some((keyword) => lowerCaseSummary.includes(keyword))) {
                isExplicitlyInvalidSummary = true; // 명시적 실패
                console.log('[Debug Validation] Ingredient Analysis summary indicates explicit failure:', ia.summary);
              } else if (Array.isArray(ia.ingredientTree) && ia.ingredientTree.length > 0) {
                hasMeaningfulIngredientAnalysis = true;
              }
            }

            // Nutrition Analysis Summary 및 데이터 검사
            if (na) {
              if (typeof na.summary === 'string' && na.summary.trim() !== '') {
                const lowerCaseSummary = na.summary.toLowerCase();
                if (knownNegativeSummaries.some((keyword) => lowerCaseSummary.includes(keyword))) {
                  isExplicitlyInvalidSummary = true; // 명시적 실패
                  console.log('[Debug Validation] Nutrition Analysis summary indicates explicit failure:', na.summary);
                }
              }

              if (!isExplicitlyInvalidSummary) {
                let hasActualNutritionData = false;
                if (na.nutrition) {
                  const nut = na.nutrition;
                  if (
                    (nut.Kcal !== undefined && nut.Kcal !== null && nut.Kcal > 0) ||
                    (nut.carbohydrate && typeof nut.carbohydrate.gram === 'number' && nut.carbohydrate.gram >= 0) ||
                    (nut.protein && typeof nut.protein.gram === 'number' && nut.protein.gram >= 0) ||
                    (nut.fat && typeof nut.fat.gram === 'number' && nut.fat.gram >= 0)
                  ) {
                    hasActualNutritionData = true;
                  }
                }

                let isSummaryMeaningful = false;
                if (typeof na.summary === 'string' && na.summary.trim() !== '') {
                  // na.summary가 존재하고, 부정 키워드를 포함하지 않을 때만 isSummaryMeaningful을 true로 설정
                  if (!knownNegativeSummaries.some((keyword) => na.summary!.toLowerCase().includes(keyword))) {
                    isSummaryMeaningful = true;
                  }
                }

                if (hasActualNutritionData || isSummaryMeaningful) {
                  hasMeaningfulNutritionAnalysis = true;
                }
              }
            }

            if (!isExplicitlyInvalidSummary && (hasMeaningfulIngredientAnalysis || hasMeaningfulNutritionAnalysis)) {
              isValidResponse = true;
            }
          }

          console.log('[Debug] 최종 응답 유효성 검사 결과:', {
            isValidResponse: isValidResponse,
            isExplicitlyInvalidSummary: isExplicitlyInvalidSummary,
            hasMeaningfulIngredientAnalysis: hasMeaningfulIngredientAnalysis,
            hasMeaningfulNutritionAnalysis: hasMeaningfulNutritionAnalysis,
            productId: productId,
          });

          if (!isValidResponse) {
            console.warn('OCR 분석 결과, 유효하지 않은 이미지로 판단됨 (내용 부족). productId:', productId, '응답 데이터:', responseData);
            setError('이미지 인식에 실패했습니다.\n내용이 잘 보이도록 다시 촬영해주세요.');

            console.warn('[ProcessAndNavigate] OCR response NOT VALID. Setting localStorage to ERROR.');
            localStorage.setItem('ocrAnalysisState', 'error');
            localStorage.setItem('ocrAnalysisMessage', '이미지 분석에 실패하여 재촬영이 필요합니다.');
            localStorage.removeItem('ocrResultId');

            // BroadcastChannel로 상태 변경 알림 (에러)
            const errorChannel = new BroadcastChannel('ocr_status_channel');
            errorChannel.postMessage({
              status: 'error',
              message: '이미지 분석에 실패하여 재촬영이 필요합니다.',
              resultId: null,
            });
            errorChannel.close();

            return; // finally로 이동
          }

          // 유효한 응답일 경우, 홈 화면 토스트를 위해 최종 상태 업데이트
          console.log('[ProcessAndNavigate] OCR response VALID. Setting localStorage to COMPLETED.');
          localStorage.setItem('ocrAnalysisState', 'completed');
          localStorage.setItem('ocrAnalysisMessage', '성분 분석이 완료되었습니다! 결과를 확인하세요.');
          localStorage.setItem('ocrResultId', productId);

          // BroadcastChannel로 상태 변경 알림
          const channel = new BroadcastChannel('ocr_status_channel');
          channel.postMessage({
            status: 'completed',
            message: '성분 분석이 완료되었습니다! 결과를 확인하세요.',
            resultId: productId,
          });
          channel.close();

          console.log('OCR 분석 결과 유효함, /report로 이동. productId:', productId);
          const navigatedHome = localStorage.getItem('ocrUserNavigatedHome');
          if (navigatedHome !== 'true') {
            router.push(`/report/${productId}`);
          }
          // 성공 시에도 finally 블록을 타도록 return
          return;
        } else {
          // productId가 없는 경우 (success: true, data: {...} 이지만 productId가 null/undefined)
          console.warn('API 응답에 productId가 없습니다. 응답 데이터:', responseData);
          const errorMessage = '제품을 특정할 수 있는 정보를 찾지 못했습니다. 사진을 확인 후 다시 시도해주세요.';
          setError(errorMessage);
          console.warn('[ProcessAndNavigate] ProductId is MISSING in API response. Setting localStorage to ERROR.');
          localStorage.setItem('ocrAnalysisState', 'error');
          localStorage.setItem('ocrAnalysisMessage', errorMessage);
          localStorage.removeItem('ocrResultId');

          // BroadcastChannel로 상태 변경 알림 (에러)
          const errorChannel = new BroadcastChannel('ocr_status_channel');
          errorChannel.postMessage({
            status: 'error',
            message: errorMessage,
            resultId: null,
          });
          errorChannel.close();

          return; // finally로 이동
        }
      } catch (err: unknown) {
        console.error('[ProcessAndNavigate] CATCH block entered. Error:', err);
        let errorMessage = '이미지 처리 중 알 수 없는 오류가 발생했습니다.';

        const apiMessage = getApiErrorMessage(err);
        if (apiMessage) {
          errorMessage = apiMessage;
        } else if (typeof err === 'object' && err !== null) {
          if ('response' in err) {
            const axiosError = err as { response?: { status?: number } };
            console.error('OCR API 서버 오류 응답:', err);
            errorMessage = `서버 응답 오류: ${axiosError.response?.status ?? '알 수 없음'}`;
          } else if ('request' in err) {
            console.error('OCR API 응답 없음:', (err as { request?: unknown }).request);
            errorMessage = '서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.';
          } else if ('message' in err && typeof (err as { message: unknown }).message === 'string') {
            errorMessage = (err as Error).message;
          }
        } else if (typeof err === 'string') {
          errorMessage = err;
        }

        setError(errorMessage);
        // catch 블록에서도 localStorage 상태 업데이트
        localStorage.setItem('ocrAnalysisState', 'error');
        localStorage.setItem('ocrAnalysisMessage', errorMessage);
        localStorage.removeItem('ocrResultId');
        console.log('[ProcessAndNavigate] CATCH block - localStorage set to ERROR. Message:', errorMessage);

        // BroadcastChannel로 상태 변경 알림 (에러)
        const errorChannel = new BroadcastChannel('ocr_status_channel');
        errorChannel.postMessage({
          status: 'error',
          message: errorMessage,
          resultId: null,
        });
        errorChannel.close();

        return; // finally로 이동
      } finally {
        // 모든 경우 (성공, 실패, 에러)에 대해 setIsProcessing(false)가 호출되도록 함
        setIsProcessing(false);
        console.log('[ProcessAndNavigate] FINALLY block. setIsProcessing(false). Current ocrAnalysisState:', localStorage.getItem('ocrAnalysisState'));
      }
    },
    [router, setError, resetToIngredientStep],
  );

  return { isProcessing, setIsProcessing, processAndNavigate };
}
