// 인기 검색어 목록 타입
export interface PopularIngredient {
  ingredientId : string;
  ingredientName: string;
  count: number;
}

// 검색어 카운트 증가 request 타입
export interface IncreaseSearchCountRequest {
  keyword: string;
}

