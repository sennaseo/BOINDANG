package com.nutritionservice.nutrition.model.document;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ProductResult {

    @Field("ingredient_analysis")
    private IngredientAnalysis ingredientAnalysis;

    @Field("nutrition_analysis")
    private NutritionAnalysis nutritionAnalysis;

    @Field("updatedAt")
    private OffsetDateTime updatedAt;
}