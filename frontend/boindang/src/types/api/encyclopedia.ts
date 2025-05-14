// 인기 검색어 목록 타입
export interface PopularIngredient {
  ingredientName: string;
  count: number;
}

export interface PopularIngredientsApiResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  data: PopularIngredient[];
} 