// API 응답에 따른 타입 정의

export interface IngredientResult {
  id : string;
  name : string;
  engName : string;
  type : string;
  riskLevel : string;
}

export interface IngredientSearchResponseData {
  originalQuery : string;
  suggestedName : string | null;
  results : IngredientResult[];
}

export interface SearchPageApiResponse {
  isSuccess : boolean;
  code : number;
  message : string;
  data? : IngredientSearchResponseData; // 성공 시에만 data가 있을 수 있음
}





// 유사 성분 비교 테이블의 각 항목 타입
export interface ComparisonTableItem {
  name: string;
  gi: number;
  calories: number;
  sweetness: number;
  note: string; // API 명세에 따름 (프론트엔드 MoreInfoTab의 'digestion'과 다름)
}

// 성분 상세 정보 API 응답의 data 필드 타입
export interface IngredientDetailData {
  id: string;
  name: string;
  engName?: string; // API 명세에는 있지만, 이전 목업에서는 없었으므로 optional로 처리하거나, 필수라면 이전 타입도 수정 필요. API 명세에 있으니 필수로.
  category: string;
  type: string;
  riskLevel: '안심' | '주의' | '위험'; // 명확한 문자열 리터럴 타입으로 지정
  gi: number;
  calories: number;
  sweetness: number;
  description: string;
  examples: string[];
  references: string[]; // API 응답은 문자열 배열, 프론트엔드는 객체 배열로 사용 중이므로 변환 필요
  
  // 건강 영향 관련 (프론트엔드에서는 healthEffects 객체로 묶여있음)
  bloodResponse: string;
  digestEffect: string;
  toothEffect: string;
  pros: string[];
  cons: string[];

  // 사용자별 참고사항 관련 (프론트엔드에서는 userConsiderations 객체로 묶여있음)
  diabetic: string[];
  kidneyPatient: string[];
  dieter: string[];
  muscleBuilder: string[];

  // 더보기 관련 (프론트엔드에서는 moreInfo 객체로 묶여있음)
  recommendedDailyIntake?: number; // API 명세에는 있지만, 이전 목업에서는 없었으므로 optional. API 명세에 있으니 필수로.
  regulatory: string;
  issue?: string; // API 명세에는 있지만, 이전 목업에서는 없었으므로 optional. API 명세에 있으니 필수로.
  compareTable: ComparisonTableItem[];
}


// 제네릭 API 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  data: T;
}

// 성분 상세 보기 API의 전체 응답 타입
export type IngredientDetailApiResponse = ApiResponse<IngredientDetailData>;

// 실패 시 API 응답 타입 (data가 없을 수 있음)
export interface ApiErrorResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data?: null; // 혹은 T | null 등으로 유연하게 처리 가능
}