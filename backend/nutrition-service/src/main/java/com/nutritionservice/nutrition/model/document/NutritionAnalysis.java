package com.nutritionservice.nutrition.model.document;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionAnalysis {
    @Field("nutrition")
    private Nutrition nutrition;
    @Field("summary")
    private String summary;
}
