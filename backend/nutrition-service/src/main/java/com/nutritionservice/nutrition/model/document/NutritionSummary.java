package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionSummary {
    private Integer Kcal;
    private Nutrient protein;
    private Nutrient carbohydrate;
    private Nutrient fat;
    private Nutrient sodium;
    private Nutrient cholesterol;
}
