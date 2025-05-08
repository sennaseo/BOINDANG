package com.nutritionservice.nutrition.model.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@Document("product_nutrition")
@Document("analysis")
public class ProductNutrition {

    @Id
    private String id;

    private String name;

    private ProductResult result; // ✅ result 필드 추가
}
