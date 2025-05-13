package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResult {
    private IngredientAnalysis ingredient_analysis;
    private NutritionAnalysis nutrition_analysis;
}

