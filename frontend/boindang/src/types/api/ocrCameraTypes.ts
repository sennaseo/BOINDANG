// OCR 카메라 페이지 관련 타입 정의

// 촬영 단계를 위한 타입 정의
export type PhotoStep = 'ingredient' | 'nutritionInfo';

// 각 단계별 가이드 메시지 정의 (타입 추론을 위해 그대로 둘 수도 있지만, 명시적 타입도 고려 가능)
// export interface GuideMessage {
//   title: string;
//   main: string;
//   sub: string[] | string;
// }
// export interface GuideMessages {
//   ingredient: GuideMessage;
//   nutritionInfo: GuideMessage;
// }

// Ingredient Analysis 내부 타입 정의
export interface IngredientAnalysisResult {
  summary?: string;
  ingredientTree?: unknown[]; // 실제 데이터 구조에 맞게 더 구체화 가능
  basicInfo?: object;
  categorizedIngredients?: object;
  giIndex?: {
    value?: number | null;
    grade?: string;
  };
}

// Nutrition Analysis 내부 타입 정의
export interface NutritionData {
  Kcal?: number;
  carbohydrate?: { gram?: number; ratio?: number; sub?: { sugar?: { gram?: number; ratio?: number }; fiber?: { gram?: number; ratio?: number } } };
  protein?: { gram?: number; ratio?: number };
  fat?: { gram?: number; ratio?: number; sub?: { saturatedFat?: { gram?: number; ratio?: number }; transFat?: { gram?: number; ratio?: number }; unsaturatedFat?: { gram?: number; ratio?: number } } };
  sodium?: { mg?: number; ratio?: number };
  cholesterol?: { mg?: number; ratio?: number };
}

export interface NutritionAnalysisResult {
  nutrition?: NutritionData;
  summary?: string;
}

// API 응답 타입 정의
export interface OcrResponseData {
  productId?: string;
  productName?: string;
  result?: {
    ingredientAnalysis?: IngredientAnalysisResult;
    nutritionAnalysis?: NutritionAnalysisResult;
  };
}

// guideMessages에 대한 명시적 타입을 원한다면 아래 주석 해제 및 사용
// export const guideMessagesData: GuideMessages = { ... }; 