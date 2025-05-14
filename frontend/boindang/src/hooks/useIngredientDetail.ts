import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // axios import 추가
import apiClient from '@/lib/apiClient'; // apiClient import 추가
import type {
  IngredientDetailApiResponse,
  IngredientDetailData,
  // ApiErrorResponse, // axios 에러 응답을 직접 사용할 수 있음
  ProcessedIngredientDetail,
} from '@/types/api/ingredients';

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
  error: string | null;
  refetch: () => void;
}

export default function useIngredientDetail(ingredientName: string | undefined): UseIngredientDetailReturn {
  const [ingredientDetail, setIngredientDetail] = useState<ProcessedIngredientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredientData = useCallback(async () => {
    if (!ingredientName) {
      setIsLoading(false);
      setError('Ingredient name is not provided.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // apiClient를 사용하여 API 호출, URL 엔드포인트 수정
      const response = await apiClient.get<IngredientDetailApiResponse>(`/encyclopedia/ingredient/${ingredientName}`);
      
      // axios는 응답 데이터를 response.data에 담아 반환
      const result = response.data; 

      if (result.isSuccess && result.data) {
        setIngredientDetail(transformApiDataToFrontend(result.data));
      } else {
        throw new Error(result.message || 'Failed to fetch ingredient data from API');
      }
    } catch (err) {
      let message = 'An unknown error occurred';
      if (axios.isAxiosError(err)) {
        // 서버에서 보내는 에러 메시지가 있다면 그것을 사용 (err.response.data.message 등)
        // IngredientDetailApiResponse의 message 필드를 사용한다고 가정
        if (err.response && err.response.data && (err.response.data as IngredientDetailApiResponse).message) {
          message = (err.response.data as IngredientDetailApiResponse).message;
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      console.error("Failed to fetch ingredient details in hook:", err);
    }
    setIsLoading(false);
  }, [ingredientName]);

  useEffect(() => {
    fetchIngredientData();
  }, [fetchIngredientData]);

  return { ingredientDetail, isLoading, error, refetch: fetchIngredientData };
} 