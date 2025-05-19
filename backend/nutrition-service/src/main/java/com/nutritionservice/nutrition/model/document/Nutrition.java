package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Nutrition {
    private Integer Kcal;
    private Nutrient protein;
    private CarbohydrateNutrient carbohydrate;
    private FatNutrient fat;
    private Nutrient sodium;
    private Nutrient cholesterol;
}
