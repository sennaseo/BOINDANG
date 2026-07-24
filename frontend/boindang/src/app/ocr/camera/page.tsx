"use client";

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Image as ImageIcon, ListBullets, Lightbulb, ChartBar, ArrowCounterClockwise, Check, ArrowRight } from '@phosphor-icons/react';
import OcrProcessingScreen from '../components/OcrProcessingScreen'; // 새로 만든 컴포넌트 import
import { usePreventSwipeBack } from '@/hooks/usePreventSwipeBack'; // 커스텀 훅 import
import { useCameraStream } from '@/hooks/useCameraStream';
import { useOcrUpload } from '@/hooks/useOcrUpload';
import { PhotoStep } from '@/types/api/ocrCameraTypes';

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

export default function OcrCameraPage() {
  const guideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // 캡처용 캔버스 참조
  const router = useRouter(); // useRouter 훅 사용
  const cameraPageContainerRef = useRef<HTMLDivElement>(null); // 스와이프 방지 및 높이 조절용 ref

  usePreventSwipeBack(cameraPageContainerRef, { edgeThreshold: 30 }); // 훅 사용

  // 카메라 스트림 획득/폴백/정리 로직 (커스텀 훅)
  const { videoRef, error, setError, getCameraStream, stopCameraStream } = useCameraStream();

  const [isGuideVisible, setIsGuideVisible] = useState(true);

  // 새로운 상태 추가
  const [currentPhotoStep, setCurrentPhotoStep] = useState<PhotoStep>('ingredient');
  const [ingredientPhoto, setIngredientPhoto] = useState<string | null>(null); // 이미지 데이터 URL 저장
  const [nutritionPhoto, setNutritionPhoto] = useState<string | null>(null); // 이미지 데이터 URL 저장

  // 새로운 상태 추가 (미리보기 기능용)
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [showPreviewScreen, setShowPreviewScreen] = useState(false);

  // 에러 발생 시 촬영 단계/사진 상태를 초기 단계로 되돌리는 콜백 (useOcrUpload에 전달)
  const resetToIngredientStep = useCallback(() => {
    setCurrentPhotoStep('ingredient');
    setIngredientPhoto(null);
    setNutritionPhoto(null);
    setIsGuideVisible(true);
  }, []);

  // presigned URL 발급 → S3 업로드 → OCR API 호출 → 결과 검증/전파 로직 (커스텀 훅)
  const { isProcessing, setIsProcessing, processAndNavigate } = useOcrUpload({
    router,
    setError,
    resetToIngredientStep,
  });

  // Ref to track if the initial camera setup and guide display has occurred
  const isInitialCameraSetupDone = useRef(false);

  // 높이 동적 조절 및 Body 스크롤 방지를 위한 useEffect
  useEffect(() => {
    document.body.classList.add('ocr-camera-active');

    const setVisualViewportHeight = () => {
      if (cameraPageContainerRef.current) {
        if (window.visualViewport) {
          cameraPageContainerRef.current.style.height = `${window.visualViewport.height}px`;
        } else {
          cameraPageContainerRef.current.style.height = `${window.innerHeight}px`;
        }
      }
    };

    setVisualViewportHeight();
    const resizeTarget = window.visualViewport || window;
    resizeTarget.addEventListener('resize', setVisualViewportHeight);

    return () => {
      document.body.classList.remove('ocr-camera-active');
      resizeTarget.removeEventListener('resize', setVisualViewportHeight);
    };
  }, []); // 의존성 배열은 비워둡니다.

  const showGuideTemporarily = useCallback(() => {
    if (guideTimeoutRef.current) {
      clearTimeout(guideTimeoutRef.current);
    }
    setIsGuideVisible(true);
    guideTimeoutRef.current = setTimeout(() => {
      setIsGuideVisible(false);
    }, 3000);
  }, [setIsGuideVisible, guideTimeoutRef]);

  // Effect for Meta Tags (runs once on mount and unmount)
  useEffect(() => {
    const setMetaTag = (name: string, content: string): string | null => {
      let metaTag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      let originalContent: string | null = null;

      if (metaTag) {
        originalContent = metaTag.getAttribute('content');
        metaTag.setAttribute('content', content);
      } else {
        metaTag = document.createElement('meta');
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
      return originalContent;
    };

    const originalStatusBarStyle = setMetaTag('apple-mobile-web-app-status-bar-style', 'black');
    const originalThemeColor = setMetaTag('theme-color', '#000000');

    return () => {
      if (originalStatusBarStyle !== null) setMetaTag('apple-mobile-web-app-status-bar-style', originalStatusBarStyle);
      if (originalThemeColor !== null) setMetaTag('theme-color', originalThemeColor);
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // Effect for Camera Stream and Guide UI (최초 마운트 시 가이드 표시 및 스트림 획득)
  useEffect(() => {
    if (!isInitialCameraSetupDone.current) {
      showGuideTemporarily();
      isInitialCameraSetupDone.current = true;
    }

    getCameraStream();

    // 가이드 타임아웃 정리 (스트림 자체 정리는 useCameraStream 훅이 언마운트 시 담당)
    const currentGuideTimeoutRef = guideTimeoutRef.current;
    return () => {
      if (currentGuideTimeoutRef) {
        console.log('[Camera] Cleanup: Clearing guide timeout.');
        clearTimeout(currentGuideTimeoutRef);
      }
    };
  }, [getCameraStream, showGuideTemporarily]);

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
      // processAndNavigate 호출 시, 확정된 영양정보 사진 전달 (기존 `newlySetNutritionPhoto || nutritionPhoto` 폴백 유지)
      processAndNavigate(ingredientPhoto, previewImageSrc || nutritionPhoto);
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
    // 현재 스트림 중지
    stopCameraStream();

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
    <div
      ref={cameraPageContainerRef}
      className="flex flex-col w-full bg-black text-white relative overflow-hidden"
    >
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
              onClick={() => {
                console.log("'준비됐어요!' 버튼 클릭됨, isGuideVisible 이전 값:", isGuideVisible);
                setIsGuideVisible(false);
                console.log("isGuideVisible 다음 값으로 설정 시도: false");
              }}
              className="mt-8 px-4 py-2 bg-[var(--color-maincolor)] hover:bg-[var(--color-maincolor-100)] rounded text-white"
            >
              준비됐어요!
            </button>
          </div>
        )}

        {/* 미리보기 화면 UI */}
        {showPreviewScreen && previewImageSrc && (
          <div className="absolute inset-0 z-30 flex flex-col bg-black">
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
