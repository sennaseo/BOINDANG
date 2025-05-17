import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // axios는 에러 타입 가드용으로 유지
import { getIngredientDetail } from '@/api/ingredients'; // <<< 새로 만든 API 함수 임포트
import type {
  IngredientDetailData,
  ProcessedIngredientDetail,
} from '@/types/api/ingredients';
import type { ApiResponse } from '@/types/api'; // <<< 공통 응답 타입 임포트

// Helper function to transform API data to frontend structure
const transformApiDataToFrontend = (apiData: IngredientDetailData): ProcessedIngredientDetail => {
  return {
    id: apiData.id,
    name: apiData.name,
    engName: apiData.engName,
    category: apiData.category,
    type: apiData.type,
    riskLevel: apiData.riskLevel,
    gi: apiData.gi,
    calories: apiData.calories,
    sweetness: apiData.sweetness,
    description: apiData.description,
    examples: apiData.examples,
    references: apiData.references.map(ref => ({ text: ref, url: '#' })), // URL은 임시로 # 처리
    labels: apiData.labels,
    healthEffects: {
      bloodSugar: apiData.bloodResponse,
      digestive: apiData.digestEffect,
      dental: apiData.toothEffect,
      pros: apiData.pros,
      cons: apiData.cons,
    },
    userConsiderations: {
      diabetes: apiData.diabetic.join('\n'),
      kidney: apiData.kidneyPatient.join('\n'),
      diet: apiData.dieter.join('\n'),
      exercise: apiData.muscleBuilder.join('\n'),
    },
    moreInfo: {
      safetyRegulation: `일일권장섭취량: ${apiData.recommendedDailyIntake || '정보 없음'}\n규제 현황: ${apiData.regulatory}\n관련 이슈: ${apiData.issue || '특이사항 없음'}`,
      comparison: apiData.compareTable.rows.map(row => ({
        name: row.name,
        gi: String(row.values[0]),
        calories: String(row.values[1]),
        sweetness: String(row.values[2]),
        riskLevel: String(row.values[3])
      })),
    }
  };
};

interface UseIngredientDetailReturn {
  ingredientDetail: ProcessedIngredientDetail | null;
  isLoading: boolean;
  error: string | null; // 에러 메시지만 전달
  refetch: () => void;
}

export default function useIngredientDetail(ingredientId: string | undefined): UseIngredientDetailReturn { // ingredientName 대신 ingredientId를 받는 것으로 가정 (API 함수에 맞춰)
  const [ingredientDetail, setIngredientDetail] = useState<ProcessedIngredientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // UI에는 에러 메시지만 표시

  const fetchIngredientData = useCallback(async () => {
    if (!ingredientId) { // ingredientName 대신 ingredientId 사용
      setIsLoading(false);
      // setError('Ingredient ID is not provided.'); // 이 에러는 UI를 가리지 않도록 콘솔에만 출력하거나 다른 방식으로 처리
      console.warn('Ingredient ID is not provided for useIngredientDetail hook.');
      setIngredientDetail(null); // ID가 없으면 데이터는 null
      return;
    }

    setIsLoading(true);
    setError(null); // 이전 에러 초기화
    try {
      // getIngredientDetail 함수 사용 (이미 ApiResponse<IngredientDetailData>를 반환)
      const response: ApiResponse<IngredientDetailData> = await getIngredientDetail(ingredientId);
      
      if (response.success && response.data) {
        setIngredientDetail(transformApiDataToFrontend(response.data));
        setError(null); // 성공 시 에러 상태 초기화
      } else {
        // response.error 객체가 존재하고, 그 안에 message가 있을 것으로 기대
        const errorMessage = response.error?.message || 'Failed to fetch ingredient data from API (no error message provided)';
        setError(errorMessage); // 에러 메시지를 상태에 설정
        setIngredientDetail(null); // 데이터는 null로 설정
        // console.error(`[임시 수정] UI 오류를 표시하지 않습니다. 원래 오류 (${ingredientId}): ${errorMessage}`, response.error);
        console.error(`Error fetching ingredient (${ingredientId}): ${errorMessage}`, response.error); 
      }
    } catch (err) { // getIngredientDetail 내부에서 이미 에러를 ApiResponse 형태로 처리하므로, 이 catch는 네트워크 오류 등 예외적인 상황에 해당
      let message = 'An unexpected error occurred while fetching ingredient details.';
      if (axios.isAxiosError(err)) { // axios 에러인 경우 좀 더 구체적인 메시지 시도
        message = err.response?.data?.error?.message || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message); // 에러 메시지를 상태에 설정
      setIngredientDetail(null); // 데이터는 null로 설정
      // console.error(`[임시 수정] UI 오류를 표시하지 않습니다. 원래 오류 (${ingredientId}): ${message}`, err);
      console.error(`Error fetching ingredient (${ingredientId}): ${message}`, err); 
    }
    setIsLoading(false);
  }, [ingredientId]); // ingredientName 대신 ingredientId 사용

  useEffect(() => {
    fetchIngredientData();
  }, [fetchIngredientData]);

  return { ingredientDetail, isLoading, error, refetch: fetchIngredientData };
} 