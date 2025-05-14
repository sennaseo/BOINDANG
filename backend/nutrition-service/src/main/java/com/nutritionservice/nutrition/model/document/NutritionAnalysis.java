package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionAnalysis {
    private Nutrition nutrition;
    private String summary;
}
