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