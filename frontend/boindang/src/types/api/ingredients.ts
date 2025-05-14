// 성분 검색 API 응답 타입


export interface SearchPageApiResponse {
  isSuccess : boolean;
  code : number;
  message : string;
  data? : IngredientSearchResponseData; // 성공 시에만 data가 있을 수 있음
}

export interface IngredientSearchResponseData {
  originalQuery : string;
  suggestedName : string | null;
  results : IngredientResult[];
}

export interface IngredientResult {
  id : string;
  name : string;
  engName : string;
  type : string;
  riskLevel : '안심' | '주의' | '위험'; // 다시 한글 리터럴 타입으로 변경
}



// 새로운 API 명세에 따른 유사 성분 비교 테이블 타입
export interface ApiCompareTableRow {
  name: string;
  values: (string | number)[];
}

export interface ApiCompareTable {
  rows: ApiCompareTableRow[];
}

// 기존 ComparisonTableItem은 IngredientDetailData에서 직접 사용되지 않으므로 주석 처리하거나 삭제 (일단 주석 처리)
/*
export interface ComparisonTableItem {
  name: string;
  gi: number;
  calories: number;
  sweetness: number;
  note: string; 
}
*/

// 성분 상세 정보 API 응답의 data 필드 타입 (새로운 API 명세 반영)
export interface IngredientDetailData {
  id: string;
  name: string;
  engName: string; // API 명세에 있으니 필수로 처리
  category: string;
  type: string;
  riskLevel: '안심' | '주의' | '위험';
  gi: number;
  calories: number;
  sweetness: number;
  description: string;
  examples: string[];
  references: string[];
  
  bloodResponse: string;
  digestEffect: string;
  toothEffect: string;
  pros: string[];
  cons: string[];

  diabetic: string[];
  kidneyPatient: string[];
  dieter: string[];
  muscleBuilder: string[];

  recommendedDailyIntake: string; // API 응답 예시가 문자열이므로 string으로 변경
  regulatory: string;
  issue: string; // API 응답 예시가 문자열이므로 string으로 변경 (필수 필드로 가정)
  labels: string[]; // 새로운 API 명세에 추가된 필드
  compareTable: ApiCompareTable; // 새로운 API 명세에 맞게 타입 변경
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

// --- 프론트엔드용 타입 정의 시작 ---

// 프론트엔드에서 사용할 가공된 참고문헌 타입
export interface ProcessedReference {
  text: string;
  url: string; 
}

// 프론트엔드 MoreInfoTab의 비교 테이블 아이템 타입
export interface ProcessedCompareTableItem {
  name: string;
  gi: string;
  calories: string;
  sweetness: string;
  riskLevel: string; 
}

// 개요 탭 Props
export interface OverviewTabProps {
  description: string; 
  examples: string[];    
  references: ProcessedReference[]; 
}

// 건강 영향 탭 Props
export interface HealthImpactTabProps {
  effects: {
    bloodSugar: string; 
    digestive: string;  
    dental: string;     
    pros: string[];
    cons: string[];
  };
}

// 사용자별 고려사항 탭 Props
export interface UserSpecificTabProps {
  considerations: {
    diabetes: string;   
    kidney: string;     
    diet: string;       
    exercise: string;   
  };
}

// 더보기 탭 Props
export interface MoreInfoTabProps {
  info: {
    safetyRegulation: string; 
    comparison: ProcessedCompareTableItem[]; 
  };
}

// 프론트엔드에서 사용할 가공된 성분 상세 데이터 타입
export interface ProcessedIngredientDetail {
  id: string;
  name: string;
  engName: string;
  category: string;
  type: string;
  riskLevel: '안심' | '주의' | '위험';
  gi: number;
  calories: number;
  sweetness: number;
  description: string;
  examples: string[];
  references: ProcessedReference[]; 
  labels: string[]; 

  healthEffects: HealthImpactTabProps['effects'];
  userConsiderations: UserSpecificTabProps['considerations'];
  moreInfo: MoreInfoTabProps['info'];
}

// --- 프론트엔드용 타입 정의 끝 ---