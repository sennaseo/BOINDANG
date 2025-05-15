package com.nutritionservice.nutrition.model.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document("product")
public class ProductNutrition {
    @Id
    private ObjectId id;
    private String name;
    private ProductResult result;
    private String ingredientImageUrl;
    private String nutritionImageUrl;
}


