"use client";

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Next Image import 추가
import { X, Image as ImageIcon, CheckCircle, ListBullets, Lightbulb, ChartBar, ArrowCounterClockwise, Check, ArrowRight } from '@phosphor-icons/react';
import { postOcrAnalysis } from '@/api/ocr'; // 경로 확인 필요, @/api/ocr.ts 가정
import { getPresignedUrl } from '@/api/image';

// 애니메이션을 위한 상수 및 스타일 함수 정의 (컴포넌트 외부)
const handImg = '/assets/sugarcube/sugar_hand.png';
const faceImgPath = '/assets/sugarcube/sugar_face.png';

const HAND_RADIUS = 28; // 손이 CheckCircle에 얼마나 가까이/멀리 있을지
const HAND_Y_OFFSET = -8; // 손을 위로 얼마나 올릴지 (CheckCircle 중심 기준)
const HAND_X_OFFSET_MULTIPLIER = 1.1; // 손을 옆으로 얼마나 더 벌릴지

const HAND_LEFT_ANGLE = (-145 * Math.PI) / 180; // 왼손 각도
const HAND_RIGHT_ANGLE = (-35 * Math.PI) / 180; // 오른손 각도

function ocrHandStyle(show: boolean, angle: number, isRight?: boolean): React.CSSProperties {
  const xPos = HAND_RADIUS * Math.cos(angle) * HAND_X_OFFSET_MULTIPLIER;
  const yPos = HAND_RADIUS * Math.sin(angle) + HAND_Y_OFFSET;
  return {
    position: 'absolute',
    left: '50%',
    top: 'calc(50% + 10px)', // 얼굴과 CheckCircle 사이의 CheckCircle 중심에 가깝도록 조정 (얼굴 높이 고려)
    width: '24px',
    height: '24px',
    transform: `translate(-50%, -50%) translate(${xPos}px, ${yPos}px)${isRight ? ' scaleX(-1)' : ''}`,
    opacity: show ? 1 : 0,
    transition: 'opacity 0.3s 0.1s ease-in-out',
    zIndex: 15, // 얼굴(z-10)보다는 위, CheckCircle(기본)보다 위
    pointerEvents: 'none',
  };
}

// 촬영 단계를 위한 타입 정의
type PhotoStep = 'ingredient' | 'nutritionInfo';

// 각 단계별 가이드 메시지 정의
const guideMessages = {
  ingredient: {
    title: "원재료명 및 함량 (1/2)",
    main: "제품 뒷면의 \'원재료명 및 함량\' 부분을 모든 내용이 빠짐없이 나오도록 화면에 맞춰 촬영해주세요.",
    sub: [
      "글자가 선명하도록 빛 반사를 피해주세요",
      "원재료 전체를 프레임 안에 담아주세요."
    ]
  },
  nutritionInfo: {
    title: "영양 정보표 (2/2)",
    main: "제품의 \'영양정보표\' 전체가\n빠짐없이 나오도록 화면에 맞춰 촬영해주세요.",
    sub: [
      "글자가 선명하도록 빛 반사를 피해주세요.",
      "영양정보표 전체를 프레임 안에 담아주세요."
    ]
  }
};

// OCR API 응답 데이터 인터페이스 정의 (예시)
interface OcrAnalysisResult {
  summary?: string;
  ingredientTree?: unknown[]; // 실제 타입으로 대체 필요
  // 기타 필요한 필드들...
}

interface NutritionSummaryResult {
  Kcal?: number;
  // 기타 영양 정보 필드들...
}

interface OcrData {
  ingredientAnalysis?: OcrAnalysisResult | null;
  nutritionAnalysis?: {
    summary?: string;
    nutritionSummary?: NutritionSummaryResult | null;
    // 기타 필요한 필드들...
  } | null;
  // 기타 최상위 API 응답 필드들...
}

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

  // 캐릭터 애니메이션 상태
  const [showAnalysisHands, setShowAnalysisHands] = useState(false);
  const [showAnalysisFace, setShowAnalysisFace] = useState(false);

  const showGuideTemporarily = () => {
    if (guideTimeoutRef.current) {
      clearTimeout(guideTimeoutRef.current);
    }
    setIsGuideVisible(true);
    guideTimeoutRef.current = setTimeout(() => {
      setIsGuideVisible(false);
    }, 3000);
  };

  useEffect(() => {
    showGuideTemporarily();

    let currentStream: MediaStream | null = null;

    const getCameraStream = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("카메라 접근 오류:", err);
        let errorMessage = "알 수 없는 카메라 오류가 발생했습니다.";
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            errorMessage = "카메라 접근 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.";
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMessage = "사용 가능한 카메라를 찾을 수 없습니다.";
          } else {
            errorMessage = `카메라를 시작하는 중 오류가 발생했습니다: ${err.message}`;
          }
        }
        setError(errorMessage);

        try {
          console.log("후면 카메라 실패, 전면 카메라 시도...");
          const frontConstraints: MediaStreamConstraints = { video: { facingMode: 'user' }, audio: false };
          currentStream = await navigator.mediaDevices.getUserMedia(frontConstraints);
          setStream(currentStream);
          setError(null);
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
          }
        } catch (frontErr) {
          console.error("전면 카메라 접근 오류:", frontErr);
        }
      }
    };

    getCameraStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        console.log("카메라 스트림 정리됨");
      }
      if (guideTimeoutRef.current) {
        clearTimeout(guideTimeoutRef.current);
        console.log("가이드 타임아웃 정리됨");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // isProcessing 상태 변경에 따른 애니메이션 효과
  useEffect(() => {
    let handTimer: NodeJS.Timeout | null = null; // null로 초기화
    let faceAnimationTimeout: NodeJS.Timeout | null = null;
    let faceInterval: NodeJS.Timeout | null = null;

    if (isProcessing) {
      // Reset states immediately
      setShowAnalysisHands(false);
      setShowAnalysisFace(false);

      // Show hands once after a delay
      handTimer = setTimeout(() => {
        setShowAnalysisHands(true);
      }, 150);

      // Start repeating face animation after an initial delay
      const initialFaceDelay = 400; // 첫 애니메이션 시작 전 지연 시간
      const animationCycleTime = 2000; // 얼굴이 올라갔다 내려오는 전체 주기 (ms)

      // Use a timeout to delay the start of the interval
      faceAnimationTimeout = setTimeout(() => {
        // Start the interval immediately showing the face (first peek up)
        setShowAnalysisFace(true);
        faceInterval = setInterval(() => {
          setShowAnalysisFace(prev => !prev); // 얼굴 보였다/숨겼다 토글 (위/아래 반복)
        }, animationCycleTime / 2); // 주기의 절반마다 상태 변경 (1초 올라가고, 1초 내려오고)
      }, initialFaceDelay);

    } else {
      // Clear timers/intervals and reset states when processing stops
      if (handTimer) clearTimeout(handTimer); // 조건부 실행
      if (faceAnimationTimeout) clearTimeout(faceAnimationTimeout);
      if (faceInterval) clearInterval(faceInterval);
      setShowAnalysisHands(false);
      setShowAnalysisFace(false);
    }

    // Cleanup function
    return () => {
      if (handTimer) clearTimeout(handTimer); // 조건부 실행
      if (faceAnimationTimeout) clearTimeout(faceAnimationTimeout);
      if (faceInterval) clearInterval(faceInterval);
    };
  }, [isProcessing]);

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

    try {
      // TODO: fileType을 동적으로 결정하거나, JPEG로 통일할지 결정 필요
      // canvas.toDataURL('image/jpeg', 0.9) 에서 'image/jpeg'를 사용했으므로, 여기서도 동일하게 사용
      const ingredientFileType = 'image/jpeg';
      const nutritionFileType = 'image/jpeg';

      // 각 이미지에 대한 고유한 파일 이름 생성 (파일 확장자는 .jpg로 가정)
      // Date.now()는 동시에 두 요청이 매우 근접하게 발생하면 중복될 수 있으나,
      // 사용자 인터랙션에 의해 순차적으로 발생하므로 이 사용 사례에서는 충분할 것으로 보입니다.
      // 더 강력한 고유성을 원하면 uuid와 같은 라이브러리를 사용하는 것이 좋습니다.
      const ingredientFileName = `ingredient-${Date.now()}.jpg`;
      const nutritionFileName = `nutrition-${Date.now() + 1}.jpg`; // 약간의 시간차를 두어 중복 방지

      console.log("원재료 이미지 업로드 시작...");
      const ingredientCloudFrontUrl = await uploadImageAndGetCloudFrontUrl(currentIngredientPhotoBase64, ingredientFileType, ingredientFileName);

      console.log("영양정보 이미지 업로드 시작...");
      const nutritionCloudFrontUrl = await uploadImageAndGetCloudFrontUrl(finalNutritionPhotoBase64, nutritionFileType, nutritionFileName);

      const requestBody = {
        ingredient_image_url: ingredientCloudFrontUrl,
        nutrition_image_url: nutritionCloudFrontUrl,
      };

      console.log("OCR API 요청 (CloudFront URLs):", requestBody);
      const ocrResponse: { data?: { productId?: string } } = await postOcrAnalysis(requestBody);
      console.log("OCR API 호출 성공:", ocrResponse);

      // ocrResponse에서 productId 추출
      const productId = ocrResponse.data?.productId;

      //product_id가 있으면 report 페이지로 이동, 없으면 홈으로 이동
      if (productId) {
        router.push(`/report/${productId}`);
      } else {
        console.warn("productId를 찾을 수 없습니다. 홈으로 이동합니다.");
        router.push('/'); 
      }

      let actualData: OcrData | undefined | null = null;
      if (ocrResponse && typeof ocrResponse === 'object' && ocrResponse !== null) {
        const responseObject = ocrResponse as Record<string, unknown>;

        if (
          responseObject.hasOwnProperty('data') &&
          typeof responseObject.data === 'object' &&
          responseObject.data !== null
        ) {
          console.log("ocrResponse.data에서 분석 데이터 추출 시도:", responseObject.data);
          actualData = responseObject.data as OcrData;
        } else if (
          responseObject.hasOwnProperty('result') &&
          typeof responseObject.result === 'object' &&
          responseObject.result !== null
        ) {
          console.log("ocrResponse.result에서 분석 데이터 추출 시도:", responseObject.result);
          actualData = responseObject.result as OcrData;
        } else if (
          responseObject.hasOwnProperty('ingredientAnalysis') ||
          responseObject.hasOwnProperty('nutritionAnalysis')
        ) {
          if (
            (responseObject.hasOwnProperty('ingredientAnalysis') && responseObject.ingredientAnalysis !== undefined) ||
            (responseObject.hasOwnProperty('nutritionAnalysis') && responseObject.nutritionAnalysis !== undefined)
          ) {
            console.log("ocrResponse에서 직접 분석 데이터 추출 시도 (카멜 케이스 키 기반 - fallback):", responseObject);
            actualData = responseObject as OcrData;
          }
        } else if (
          responseObject.hasOwnProperty('ingredient_analysis') ||
          responseObject.hasOwnProperty('nutrition_analysis')
        ) {
          if (
            (responseObject.hasOwnProperty('ingredient_analysis') && responseObject.ingredient_analysis !== undefined) ||
            (responseObject.hasOwnProperty('nutrition_analysis') && responseObject.nutrition_analysis !== undefined)
          ) {
            console.log("ocrResponse에서 직접 분석 데이터 추출 시도 (스네이크 케이스 키 기반 - fallback):", responseObject);
            actualData = responseObject as OcrData;
          }
        }
      }

      console.log("--- [Debug] actualData 추출 시도 후 ---");
      if (!actualData) {
        console.error("[!!! Critical !!!] 유효한 OCR 분석 데이터를 찾을 수 없거나 API 응답 형식이 예상과 다릅니다:", ocrResponse);
        setError("OCR 분석 결과를 처리할 수 없습니다.\n응답 형식을 확인해주세요.");
        setIsProcessing(false);
        return;
      }
      console.log("최종 분석 데이터(actualData) 성공적으로 추출됨:", actualData);

      const ingAnalysis = actualData.ingredientAnalysis;
      const nutAnalysis = actualData.nutritionAnalysis;

      // OCR 결과 유효성 검사 (actualData 사용)
      if (ingAnalysis === null && nutAnalysis === null) {
        console.warn("OCR 분석 결과, ingredientAnalysis와 nutritionAnalysis 모두 명시적으로 null입니다:", actualData);
        setError("이미지 분석에 실패했습니다.\n두 정보 모두 인식되지 않았습니다.");
        setIsProcessing(false);
        return;
      }

      let isIngredientInvalid: boolean = false;
      if (ingAnalysis) {
        isIngredientInvalid = Boolean(
          (typeof ingAnalysis.summary === 'string' &&
            (ingAnalysis.summary.includes("불가능합니다") ||
              ingAnalysis.summary.includes("정보가 없어") ||
              ingAnalysis.summary.includes("제공되어 성분 정보가 없어"))) ||
          (Array.isArray(ingAnalysis.ingredientTree) &&
            ingAnalysis.ingredientTree.length === 0)
        );
        console.log("[Debug] Ingredient Analysis:", ingAnalysis.summary, "isInvalid:", isIngredientInvalid);
      } else if (ingAnalysis === undefined && nutAnalysis?.summary?.includes("식품이 아닌")) {
        isIngredientInvalid = true;
        console.log("[Debug] Ingredient undefined, Nut non-food. isIngredientInvalid:", isIngredientInvalid);
      } else if (ingAnalysis === undefined && nutAnalysis?.summary?.includes("비식품입니다")) {
        isIngredientInvalid = true;
        console.log("[Debug] Ingredient undefined, Nut non-food (bisikpum). isIngredientInvalid:", isIngredientInvalid);
      } else {
        console.log("[Debug] Ingredient Analysis: No specific invalid condition met or ingAnalysis is null/undefined.", ingAnalysis);
      }


      let isNutritionInvalid: boolean = false;
      if (nutAnalysis) {
        isNutritionInvalid = Boolean(
          (typeof nutAnalysis.summary === 'string' &&
            (nutAnalysis.summary.includes("식품이 아닌 제품입니다") ||
              nutAnalysis.summary.includes("정보가 없는 식품이거나") ||
              nutAnalysis.summary.includes("분석할 수 없습니다") ||
              nutAnalysis.summary.includes("비식품입니다"))) ||
          (nutAnalysis.nutritionSummary && typeof nutAnalysis.nutritionSummary.Kcal === 'number' &&
            nutAnalysis.nutritionSummary.Kcal === 0 &&
            (!nutAnalysis.summary || !nutAnalysis.summary.includes("영양 정보가 없는 식품이거나"))
          )
        );
        console.log("[Debug] Nutrition Analysis:", nutAnalysis.summary, "isInvalid:", isNutritionInvalid);
        if (nutAnalysis.nutritionSummary) {
          console.log("[Debug] Nutrition Kcal:", nutAnalysis.nutritionSummary.Kcal);
        }
      } else if (nutAnalysis === undefined && ingAnalysis?.summary?.includes("불가능합니다")) {
        isNutritionInvalid = true;
        console.log("[Debug] Nutrition undefined, Ing impossible. isNutritionInvalid:", isNutritionInvalid);
      } else {
        console.log("[Debug] Nutrition Analysis: No specific invalid condition met or nutAnalysis is null/undefined.", nutAnalysis);
      }

      const finalIsIngredientInvalid = isIngredientInvalid;
      const finalIsNutritionInvalid = isNutritionInvalid;
      const bothAnalysesUndefined = ingAnalysis === undefined && nutAnalysis === undefined;

      console.log("[Debug] Final Validation Check:", {
        finalIsIngredientInvalid,
        finalIsNutritionInvalid,
        ingSummary: ingAnalysis?.summary,
        nutSummary: nutAnalysis?.summary,
        ingTreeLength: ingAnalysis?.ingredientTree?.length,
        nutKcal: nutAnalysis?.nutritionSummary?.Kcal,
        bothAnalysesUndefined
      });

      if (finalIsIngredientInvalid || finalIsNutritionInvalid || bothAnalysesUndefined) {
        console.warn("OCR 분석 결과, 유효하지 않은 이미지로 판단됨 (최종 결정):", {
          isIngredientInvalid: finalIsIngredientInvalid,
          isNutritionInvalid: finalIsNutritionInvalid,
          actualData
        });
        setError("이미지 인식에 실패했습니다.\n내용이 잘 보이도록 다시 촬영해주세요.");
        setIsProcessing(false);
        return;
      }

      if (ingAnalysis === undefined || nutAnalysis === undefined) {
        if (!(ingAnalysis === null && nutAnalysis === null)) {
          console.error("OCR API 응답 데이터에 주요 분석 필드(ingredientAnalysis 또는 nutritionAnalysis)가 누락되었습니다:", actualData);
          setError("OCR 분석 정보가 완전하지 않습니다.\n다시 시도해주세요.");
          setIsProcessing(false);
          return;
        }
      }

      console.log("OCR 분석 결과 유효함, /report로 이동");
      router.push('/report');

    } catch (err: unknown) {
      console.error("OCR 처리 중 오류 발생:", err);
      let errorMessage = "이미지 처리 중 알 수 없는 오류가 발생했습니다.";

      // Axios 에러인지 확인 (타입 가드)
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string }, status?: number } }; // 간단한 타입 단언
        console.error('OCR API 서버 오류 응답:', axiosError.response?.data);
        errorMessage = axiosError.response?.data?.message || `서버 응답 오류: ${axiosError.response?.status}`;
      } else if (typeof err === 'object' && err !== null && 'request' in err) { // Axios 요청 관련 에러
        console.error('OCR API 응답 없음:', (err as { request?: unknown }).request); // any를 unknown으로 변경
        errorMessage = "서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.";
      } else if (err instanceof Error) { // 일반 JavaScript 오류
        errorMessage = err.message || "이미지 처리 중 오류가 발생했습니다.";
      }
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
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

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-black text-white relative overflow-hidden">
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
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

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

        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30 p-8">
            {/* 캐릭터 애니메이션 컨테이너 */}
            <div className="relative flex flex-col items-center justify-center mb-3"> {/* 여백 mb-3 추가 */}
              {/* 얼굴 이미지 */}
              {/* <img
                src={faceImgPath}
                alt="캐릭터 얼굴"
                className={`w-20 h-20 transition-all duration-500 ease-out z-10 ${showAnalysisFace ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              /> */}
              <div className={`relative w-20 h-20 transition-all duration-500 ease-out z-10 ${showAnalysisFace ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Image src={faceImgPath} alt="캐릭터 얼굴" layout="fill" objectFit="contain" />
              </div>
              {/* CheckCircle 아이콘 - 얼굴 뒤로 가도록 top 조정 및 relative */}
              <div className="relative w-16 h-16 mt-[-28px]"> {/* CheckCircle을 감싸서 손 위치의 기준점으로 삼기 용이하게 */}
                {/* 왼손 */}
                {/* <img
                  src={handImg}
                  alt="왼손"
                  style={ocrHandStyle(showAnalysisHands, HAND_LEFT_ANGLE)}
                /> */}
                <div style={ocrHandStyle(showAnalysisHands, HAND_LEFT_ANGLE)} className="relative w-6 h-6">
                  <Image src={handImg} alt="왼손" layout="fill" objectFit="contain" />
                </div>
                {/* 오른손 */}
                {/* <img
                  src={handImg}
                  alt="오른손"
                  style={ocrHandStyle(showAnalysisHands, HAND_RIGHT_ANGLE, true)}
                /> */}
                <div style={ocrHandStyle(showAnalysisHands, HAND_RIGHT_ANGLE, true)} className="relative w-6 h-6">
                  <Image src={handImg} alt="오른손" layout="fill" objectFit="contain" />
                </div>
                <CheckCircle size={64} weight="fill" className="text-[var(--color-maincolor)]" />
              </div>
            </div>

            <p className="text-center text-xl font-semibold text-white">
              이미지 분석 중...
            </p>
            <p className="text-center text-sm text-gray-300 mt-2">
              잠시만 기다려주세요.
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
            <p className="text-center">{error}</p>
          </div>
        )}
      </div>

      {/* 하단 컨트롤 바: 앨범, 촬영 버튼 등 */}
      {!isProcessing && (
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
