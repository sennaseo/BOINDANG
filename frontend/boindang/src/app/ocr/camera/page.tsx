"use client";

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Image as ImageIcon, ListBullets, Lightbulb, ChartBar, ArrowCounterClockwise, Check, ArrowRight } from '@phosphor-icons/react';
import { postOcrAnalysis } from '@/api/ocr'; // 경로 확인 필요, @/api/ocr.ts 가정
import { getPresignedUrl } from '@/api/image';
import OcrProcessingScreen from '../components/OcrProcessingScreen'; // 새로 만든 컴포넌트 import
import { usePreventSwipeBack } from '@/hooks/usePreventSwipeBack'; // 커스텀 훅 import
import { ApiResponse } from '@/types/api';
import { PhotoStep, OcrResponseData } from '@/types/api/ocrCameraTypes';

// 각 단계별 가이드 메시지 정의
const guideMessages = {
  ingredient: {
    title: "원재료명 및 함량 (1/2)",
    main: "제품 뒷면의 '원재료명 및 함량' 부분을 모든 내용이 빠짐없이 나오도록 화면에 맞춰 촬영해주세요.",
    sub: [
      "글자가 선명하도록 빛 반사를 피해주세요",
      "원재료 전체를 프레임 안에 담아주세요."
    ]
  },
  nutritionInfo: {
    title: "영양 정보표 (2/2)",
    main: "제품의 '영양정보표' 전체가\n빠짐없이 나오도록 화면에 맞춰 촬영해주세요.",
    sub: [
      "글자가 선명하도록 빛 반사를 피해주세요.",
      "영양정보표 전체를 프레임 안에 담아주세요."
    ]
  }
};

// Helper to stop a stream
const stopMediaStream = (mediaStream: MediaStream | null) => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
};

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
    console.warn("uploadImageAndGetCloudFrontUrl: base64Data가 data URI 형식이 아닙니다. 그대로 반환 시도:", base64Data.substring(0, 100));
    throw new Error("잘못된 형식의 이미지 데이터입니다 (Data URI 필요).");
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
    console.error("S3 업로드 실패 응답:", errorText);
    throw new Error(`이미지 업로드에 실패했습니다 (S3). 상태: ${uploadResponse.status}`);
  }

  // 4. CloudFront URL 구성
  // 이전: s3PresignedUrl에서 objectKey 추출
  // const urlObject = new URL(s3PresignedUrl);
  // const objectKey = urlObject.pathname.startsWith('/') ? urlObject.pathname.substring(1) : urlObject.pathname;

  // 변경: API 응답에서 받은 fileKey를 사용
  const cloudFrontUrl = `https://d1d5plumlg2gxc.cloudfront.net/${objectKey}`;

  console.log(`이미지 업로드 성공: ${cloudFrontUrl}`);
  return cloudFrontUrl;
}

export default function OcrCameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const guideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // 캡처용 캔버스 참조
  const router = useRouter(); // useRouter 훅 사용
  const cameraPageContainerRef = useRef<HTMLDivElement>(null); // 스와이프 방지용 ref

  usePreventSwipeBack(cameraPageContainerRef, { edgeThreshold: 30 }); // 훅 사용

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGuideVisible, setIsGuideVisible] = useState(true);

  // 새로운 상태 추가
  const [currentPhotoStep, setCurrentPhotoStep] = useState<PhotoStep>('ingredient');
  const [ingredientPhoto, setIngredientPhoto] = useState<string | null>(null); // 이미지 데이터 URL 저장
  const [nutritionPhoto, setNutritionPhoto] = useState<string | null>(null); // 이미지 데이터 URL 저장
  const [isProcessing, setIsProcessing] = useState(false); // 처리 중 상태

  // 새로운 상태 추가 (미리보기 기능용)
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [showPreviewScreen, setShowPreviewScreen] = useState(false);

  const showGuideTemporarily = useCallback(() => {
    if (guideTimeoutRef.current) {
      clearTimeout(guideTimeoutRef.current);
    }
    setIsGuideVisible(true);
    guideTimeoutRef.current = setTimeout(() => {
      setIsGuideVisible(false);
    }, 3000);
  }, [setIsGuideVisible, guideTimeoutRef]);

  const getCameraStream = useCallback(async () => {
    // 기존 스트림 중지 (videoRef 또는 state 기준)
    if (videoRef.current && videoRef.current.srcObject) {
      stopMediaStream(videoRef.current.srcObject as MediaStream);
      videoRef.current.srcObject = null;
    } else if (stream) { // videoRef에 없지만 state에 남아있을 경우
      stopMediaStream(stream);
    }
    setStream(null); // 상태도 확실히 초기화

    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null); // 성공 시 이전 카메라 오류 초기화
    } catch (err) {
      console.error("후면 카메라 접근 오류:", err);
      let errorMessage = "카메라 접근 중 오류가 발생했어요. 권한을 확인해주세요.";
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = "카메라 권한이 거부되었어요. 설정에서 허용해주세요.";
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage = "카메라를 찾을 수 없어요. 다른 앱에서 사용 중인지 확인해주세요.";
        } else {
          errorMessage = `카메라 오류: ${err.message}`;
        }
      }
      // 후면 카메라 실패 시 전면 카메라 시도
      try {
        console.log("후면 카메라 실패, 전면 카메라 시도 중...");
        const frontConstraints: MediaStreamConstraints = { video: { facingMode: 'user' }, audio: false };
        const frontStream = await navigator.mediaDevices.getUserMedia(frontConstraints);
        setStream(frontStream);
        if (videoRef.current) {
          videoRef.current.srcObject = frontStream;
        }
        setError(null); // 전면 카메라 성공 시 오류 초기화
      } catch (frontErr) {
        console.error("전면 카메라 접근 오류:", frontErr);
        setError(errorMessage); // 전면도 실패하면 후면 카메라 오류 메시지 사용
        setStream(null); // 모든 시도 실패 시 스트림 상태 null로 확실히 설정
      }
    }
  }, [setStream, setError, stream]); // stream 추가, videoRef는 ref이므로 의존성 배열에 불필요

  useEffect(() => {
    const setMetaTag = (name: string, content: string): string | null => {
      let metaTag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      let originalContent: string | null = null;

      if (metaTag) {
        originalContent = metaTag.getAttribute('content');
        metaTag.setAttribute('content', content);
      } else {
        // 메타 태그가 없으면 생성 (주로 theme-color를 위해)
        metaTag = document.createElement('meta');
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
        // 새로 생성된 경우 originalContent는 null (또는 기본값으로 처리 가능)
      }
      return originalContent;
    };

    // 페이지 진입 시 OCR 페이지 스타일 적용
    const originalStatusBarStyle = setMetaTag('apple-mobile-web-app-status-bar-style', 'black');
    const originalThemeColor = setMetaTag('theme-color', '#000000');

    showGuideTemporarily();
    getCameraStream();

    const videoElement = videoRef.current; // useEffect 내부 변수로 복사

    return () => {
      // 컴포넌트 언마운트 시 스트림 정리
      if (videoElement && videoElement.srcObject) { // 복사한 변수 사용
        stopMediaStream(videoElement.srcObject as MediaStream);
        // videoElement.srcObject = null; // 이미 DOM에서 사라지므로 이 줄은 불필요할 수 있음
      } else if (stream) { // stream 사용
        stopMediaStream(stream);
      }
      // setStream(null); // 여기서 setStream(null) 호출 시, 이미 언마운트된 컴포넌트 상태 업데이트 경고 발생 가능성. 스트림 중지만 수행.

      if (guideTimeoutRef.current) {
        clearTimeout(guideTimeoutRef.current);
      }
      // 메타 태그 복원 (기존 로직 유지)
      if (originalStatusBarStyle !== null) setMetaTag('apple-mobile-web-app-status-bar-style', originalStatusBarStyle);
      if (originalThemeColor !== null) setMetaTag('theme-color', originalThemeColor);
    };
  }, [getCameraStream, showGuideTemporarily, stream]); // stream 추가
  // stream 상태는 getCameraStream 내부에서 관리되므로, 최상위 useEffect의 의존성에서는 제외 => 이 주석은 틀렸음. cleanup에서 stream을 직접 사용하므로 추가해야 함.

  const handleAlbumClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setPreviewImageSrc(imageDataUrl);
        setShowPreviewScreen(true);
        setIsGuideVisible(false);
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 'X' 버튼 클릭 핸들러 (뒤로 가기)
  const handleCloseClick = () => {
    router.push('/');
  };

  const handleShowGuide = () => {
    setIsGuideVisible(true);
  };

  const processAndNavigate = async (newlySetNutritionPhoto?: string) => {
    const currentIngredientPhotoBase64 = ingredientPhoto;
    const finalNutritionPhotoBase64 = newlySetNutritionPhoto || nutritionPhoto;

    if (!currentIngredientPhotoBase64 || !finalNutritionPhotoBase64) {
      setError("원재료 및 영양 정보 사진이 모두 필요합니다.");
      setCurrentPhotoStep('ingredient');
      setIngredientPhoto(null);
      setNutritionPhoto(null);
      setIsGuideVisible(true);
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setError(null);

    // OCR 분석 대기 화면 디자인을 위해 여기서 함수를 조기 종료합니다.
    // 실제 프로덕션에서는 이 부분을 제거하거나 조건부로 처리해야 합니다.
    if (process.env.NODE_ENV !== 'production') { // 프로덕션 환경이 아닐 때 (개발 또는 테스트 환경)
      console.log('[Debug] OCR 대기 화면 테스트를 위해 API 호출 및 페이지 이동을 건너뜁니다.');
      return; // 여기서 함수를 종료하여 대기 화면에 머무름
    }

    try {
      const ingredientFileType = 'image/jpeg';
      const nutritionFileType = 'image/jpeg';
      const ingredientFileName = `ingredient-${Date.now()}.jpg`;
      const nutritionFileName = `nutrition-${Date.now() + 1}.jpg`;

      console.log("원재료 이미지 업로드 시작...");
      // currentIngredientPhotoBase64와 finalNutritionPhotoBase64는 위의 null 체크로 인해 string임이 보장됨
      const ingredientCloudFrontUrl = await uploadImageAndGetCloudFrontUrl(currentIngredientPhotoBase64, ingredientFileType, ingredientFileName);

      console.log("영양정보 이미지 업로드 시작...");
      const nutritionCloudFrontUrl = await uploadImageAndGetCloudFrontUrl(finalNutritionPhotoBase64, nutritionFileType, nutritionFileName);

      const requestBody = {
        ingredient_image_url: ingredientCloudFrontUrl,
        nutrition_image_url: nutritionCloudFrontUrl,
      };

      console.log("OCR API 요청 (CloudFront URLs):", requestBody);
      const ocrResponse: ApiResponse<OcrResponseData> = await postOcrAnalysis(requestBody);
      console.log("OCR API 호출 성공:", ocrResponse);

      const productId = ocrResponse.data?.productId;
      console.log("productId:", productId);

      if (ocrResponse.data && productId) {
        // 1. "Unknown Product" 조기 차단
        if (ocrResponse.data.productName === "Unknown Product") {
          console.warn("[Validation Fail] productName이 'Unknown Product'입니다. productId:", productId);
          setError("제품 정보를 명확히 인식할 수 없습니다.\n사진을 다시 촬영해주세요.");
          setIsProcessing(false);
          setCurrentPhotoStep('ingredient');
          setIngredientPhoto(null);
          setNutritionPhoto(null);
          showGuideTemporarily();
          return; // 로컬 스토리지 저장 및 추가 검증 없이 종료
        }

        // 일단 로컬 스토리지에 현재 분석 시도 결과를 저장
        const currentProductDataKey = `product_data_${productId}`;
        try {
          localStorage.setItem(currentProductDataKey, JSON.stringify(ocrResponse.data));
        } catch (storageErr) {
          console.warn("로컬 스토리지 저장 실패 (초기 저장):", storageErr);
          // 저장 실패 시 심각한 오류는 아니므로 일단 계속 진행하되, 복구 로직 고려 가능
        }

        const resultData = ocrResponse.data.result;
        let isValidResponse = false;

        if (resultData) {
          const ia = resultData.ingredientAnalysis;
          const na = resultData.nutritionAnalysis;

          // 디버깅을 위해 각 분석 결과의 존재 여부와 내용을 로그로 남깁니다.
          console.log("[Debug] Ingredient Analysis for validation:", ia);
          console.log("[Debug] Nutrition Analysis for validation:", na);

          const hasMeaningfulIngredientAnalysis =
            ia &&
            typeof ia.summary === 'string' &&
            ia.summary.trim() !== "" &&
            Array.isArray(ia.ingredientTree) && // ingredientTree가 배열인지 확인
            ia.ingredientTree.length > 0;

          let hasMeaningfulNutritionAnalysis = false;
          if (na && na.nutrition) {
            const nut = na.nutrition;
            // Kcal 또는 다른 주요 영양소 중 하나라도 0보다 큰 유의미한 값이 있는지 확인
            // 각 영양소 객체가 존재하는지 먼저 확인
            if (
              (nut.Kcal && nut.Kcal > 0) ||
              (nut.carbohydrate && typeof nut.carbohydrate.gram === 'number' && nut.carbohydrate.gram > 0) ||
              (nut.protein && typeof nut.protein.gram === 'number' && nut.protein.gram > 0) ||
              (nut.fat && typeof nut.fat.gram === 'number' && nut.fat.gram > 0) ||
              (nut.sodium && typeof nut.sodium.mg === 'number' && nut.sodium.mg > 0) ||
              (nut.cholesterol && typeof nut.cholesterol.mg === 'number' && nut.cholesterol.mg > 0)
            ) {
              hasMeaningfulNutritionAnalysis = true;
            }

            // summary가 알려진 "정보 없음" 메시지가 아니고, 비어있지도 않은 경우 유효하다고 판단
            const knownInvalidSummaries = [
              "영양정보가 제공되지 않은 제품입니다.",
              "영양정보가 제공되지 않아 분석할 수 없습니다." // 스크린샷에서 확인된 메시지
              // 필요에 따라 다른 "정보 없음" 유형의 메시지 추가 가능
            ];
            if (
              typeof na.summary === 'string' &&
              na.summary.trim() !== "" &&
              !knownInvalidSummaries.includes(na.summary.trim()) // trim() 추가하여 앞뒤 공백 제거 후 비교
            ) {
              hasMeaningfulNutritionAnalysis = true;
            }
          }

          if (hasMeaningfulIngredientAnalysis || hasMeaningfulNutritionAnalysis) {
            isValidResponse = true;
          }
        }

        console.log("[Debug] 최종 응답 유효성 검사 결과:", {
          isValidResponse,
          productId
        });

        if (!isValidResponse) {
          console.warn("OCR 분석 결과, 유효하지 않은 이미지로 판단됨 (내용 부족). productId:", productId, "응답 데이터:", ocrResponse.data);
          setError("이미지 인식에 실패했습니다.\n내용이 잘 보이도록 다시 촬영해주세요.");

          // 2. 상세 분석 실패 시 로컬 스토리지에서 해당 데이터 삭제
          try {
            localStorage.removeItem(currentProductDataKey);
            console.log(`[LocalStorage Cleanup] 키 '${currentProductDataKey}'의 데이터를 삭제했습니다.`);
          } catch (storageErr) {
            console.warn("[LocalStorage Cleanup] 실패:", storageErr);
          }

          setIsProcessing(false);
          setCurrentPhotoStep('ingredient');
          setIngredientPhoto(null);
          setNutritionPhoto(null);
          showGuideTemporarily();
          return;
        }

        console.log("OCR 분석 결과 유효함, /report로 이동. productId:", productId);
        router.push(`/report/${productId}`);

        return;
      } else {
        console.warn("productId를 찾을 수 없거나 API 응답 데이터가 없습니다.");
        setError("분석 결과를 가져오는데 실패했습니다. 다시 시도해주세요.");
        setIsProcessing(false);
        setCurrentPhotoStep('ingredient');
        setIngredientPhoto(null);
        setNutritionPhoto(null);
        showGuideTemporarily();
      }

    } catch (err: unknown) {
      console.error("OCR 처리 중 오류 발생:", err);
      let errorMessage = "이미지 처리 중 알 수 없는 오류가 발생했습니다.";

      if (typeof err === 'object' && err !== null) {
        if ('response' in err) {
          const axiosError = err as { response?: { data?: { message?: string }, status?: number } };
          console.error('OCR API 서버 오류 응답:', axiosError.response?.data);
          errorMessage = axiosError.response?.data?.message || `서버 응답 오류: ${axiosError.response?.status ?? '알 수 없음'}`;
        } else if ('request' in err) {
          console.error('OCR API 응답 없음:', (err as { request?: unknown }).request);
          errorMessage = "서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.";
        } else if ('message' in err && typeof (err as { message: unknown }).message === 'string') {
          errorMessage = (err as Error).message;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      // 개발 중 디버깅을 위해 return으로 조기 종료하는 경우 setIsProcessing(false)를 호출하지 않도록 합니다.
      if (process.env.NODE_ENV === 'production') { // 프로덕션 환경일 때만 false로 설정
        setIsProcessing(false);
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);

        setPreviewImageSrc(imageDataUrl);
        setShowPreviewScreen(true);
        setIsGuideVisible(false);
      }
    }
  };

  // 미리보기 화면 관련 핸들러
  const handleConfirmPhoto = () => {
    if (!previewImageSrc) return;

    if (currentPhotoStep === 'ingredient') {
      setIngredientPhoto(previewImageSrc);
      setCurrentPhotoStep('nutritionInfo');
      setIsGuideVisible(true); // 다음 단계 가이드 표시
    } else if (currentPhotoStep === 'nutritionInfo') {
      setNutritionPhoto(previewImageSrc);
      // processAndNavigate 호출 시, 확정된 영양정보 사진 전달
      processAndNavigate(previewImageSrc);
    }
    setPreviewImageSrc(null);
    setShowPreviewScreen(false);
  };

  const handleRetakePhoto = () => {
    setPreviewImageSrc(null);
    setShowPreviewScreen(false);
    setIsGuideVisible(true); // 현재 단계 가이드 다시 표시
    // 앨범에서 선택한 경우 input 값 초기화 (선택 사항)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // "다시 시도" 버튼 핸들러
  const handleRetryAfterError = () => {
    // 현재 스트림 중지 (handleRetryAfterError 내에서 명시적으로 처리)
    if (videoRef.current && videoRef.current.srcObject) {
      stopMediaStream(videoRef.current.srcObject as MediaStream);
      videoRef.current.srcObject = null;
    } else if (stream) { // videoRef에 없지만 state에 남아있을 경우
      stopMediaStream(stream);
    }
    setStream(null); // 스트림 상태 초기화

    setError(null);
    setIsProcessing(false);
    setCurrentPhotoStep('ingredient');
    setIngredientPhoto(null);
    setNutritionPhoto(null);
    setPreviewImageSrc(null);
    setShowPreviewScreen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    getCameraStream(); // 새로운 스트림 요청
    showGuideTemporarily(); // 가이드 다시 표시
  };

  return (
    <div ref={cameraPageContainerRef} className="flex flex-col h-screen w-full max-w-md mx-auto bg-black text-white relative overflow-hidden">
      {/* 상단 바: X 버튼, 촬영 가이드 버튼 - 에러 없을 때만 표시 */}
      {!isProcessing && !error && (
        <div className="h-16 flex justify-between items-center p-4 z-10">
          <button className="p-2" onClick={handleCloseClick}>
            <X size={28} weight="bold" />
          </button>
          <button onClick={handleShowGuide} className="text-sm font-semibold px-3 py-1.5 rounded bg-black bg-opacity-40">
            촬영 가이드
          </button>
        </div>
      )}

      <div className="flex-grow relative overflow-hidden">
        {!isProcessing && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {isGuideVisible && !isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 z-20 p-8 text-center">
            {currentPhotoStep === 'ingredient' ? (
              <ListBullets size={48} weight="bold" className="mb-6 text-[var(--color-maincolor)]" />
            ) : (
              <ChartBar size={48} weight="bold" className="mb-6 text-[var(--color-maincolor)]" />
            )}
            <p className="text-xl mb-4 whitespace-pre-line font-bold">
              {guideMessages[currentPhotoStep].title}
            </p>
            <p className="text-lg mb-4 whitespace-pre-line font-semibold">
              {currentPhotoStep === 'nutritionInfo' ?
                (() => {
                  const text = guideMessages.nutritionInfo.main;
                  const phraseToBold = "빠짐없이 나오도록";
                  if (text.includes(phraseToBold)) {
                    const parts = text.split(phraseToBold);
                    return (
                      <>
                        {parts[0]}
                        <strong>{phraseToBold}</strong>
                        {parts[1]}
                      </>
                    );
                  }
                  return text; // 혹시 문구가 바뀌어 phraseToBold가 없는 경우 원래 텍스트 반환
                })() :
                guideMessages[currentPhotoStep].main
              }
            </p>

            {Array.isArray(guideMessages[currentPhotoStep].sub) ? (
              <div className="mt-6 flex flex-col items-center w-full max-w-xs px-4">
                <div className="flex items-center mb-2">
                  <Lightbulb size={20} weight="bold" className="mr-2 text-yellow-400" />
                  <p className="text-sm font-semibold text-yellow-400">TIP</p>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {(guideMessages[currentPhotoStep].sub as string[]).map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-6 text-sm mb-6 whitespace-pre-line">
                {guideMessages[currentPhotoStep].sub as string}
              </p>
            )}

            <button
              onClick={() => setIsGuideVisible(false)}
              className="mt-8 px-4 py-2 bg-[var(--color-maincolor)] hover:bg-[var(--color-maincolor-100)] rounded text-white"
            >
              준비됐어요!
            </button>
          </div>
        )}

        {/* 미리보기 화면 UI */}
        {showPreviewScreen && previewImageSrc && (
          <div className="absolute inset-0 z-30 flex flex-col bg-black">
            {/* <img src={previewImageSrc} alt="촬영된 이미지 미리보기" className="flex-grow object-contain" /> */}
            <div className="relative flex-grow">
              <Image src={previewImageSrc} alt="촬영된 이미지 미리보기" layout="fill" objectFit="contain" />
            </div>
            <div className="grid grid-cols-10 items-center h-28 px-4 py-4 bg-black bg-opacity-80 gap-x-2 sm:gap-x-4">
              <button
                onClick={handleRetakePhoto}
                className="col-span-3 flex flex-col items-center text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowCounterClockwise size={32} weight="bold" />
                <span className="mt-1 text-xs">다시 찍기</span>
              </button>
              <button
                onClick={handleConfirmPhoto}
                className="col-span-7 flex flex-col items-center text-white p-2 rounded-lg bg-[var(--color-maincolor)] hover:bg-[var(--color-maincolor-100)] transition-colors"
              >
                {currentPhotoStep === 'ingredient' ? (
                  <ArrowRight size={32} weight="bold" />
                ) : (
                  <Check size={32} weight="bold" />
                )}
                <span className="mt-1 text-xs">
                  {currentPhotoStep === 'ingredient' ? "다음 단계" : "분석 시작"}
                </span>
              </button>
            </div>
          </div>
        )}

        {isProcessing && <OcrProcessingScreen />}

        {error && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90 p-8 text-white">
            <Image
              src="/assets/quiz/sugar_X.png"
              alt="Error Character"
              width={180} // 이미지 크기는 디자인에 맞게 조절
              height={180} // 이미지 크기는 디자인에 맞게 조절
              className="mb-6 opacity-90"
            />
            <p className="mb-8 text-center text-lg font-semibold whitespace-pre-line">
              {error}
            </p>
            <button
              onClick={handleRetryAfterError}
              className="rounded-lg bg-[var(--color-maincolor)] px-10 py-3 text-base font-bold text-white hover:bg-[var(--color-maincolor-100)] active:scale-95 transition-all duration-150 ease-in-out shadow-lg"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>

      {/* 하단 컨트롤 바: 앨범, 촬영 버튼 등 - isProcessing이 false이고, error가 없을 때만 표시 */}
      {!isProcessing && !error && (
        <div className="h-28 flex justify-between items-center px-8 py-4 z-10">
          <button className="p-2" onClick={handleAlbumClick}>
            <ImageIcon size={32} />
          </button>
          <button
            className="w-16 h-16 rounded-full border-4 border-white bg-transparent flex items-center justify-center active:bg-white/20"
            onClick={handleCapture}
            disabled={isProcessing} // 이 disabled는 isProcessing이 true일 때 적용되므로, 부모가 숨겨지면 의미가 없어지지만, 일단 유지
          >
            <div className="w-12 h-12 rounded-full bg-white"></div>
          </button>
          <div className="w-[48px]"></div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isProcessing} // 처리 중일 때 파일 입력 비활성화
      />
      {/* 캡처용 숨겨진 캔버스 */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
