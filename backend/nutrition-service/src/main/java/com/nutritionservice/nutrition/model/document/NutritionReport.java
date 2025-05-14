package com.nutritionservice.nutrition.model.document;

import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.IngredientDetail;
import com.nutritionservice.nutrition.model.dto.external.TopRisk;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document("report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionReport {

    @Id
    private String id;

    private String userId;
    private String productId;
    private String productName;
    private LocalDateTime analyzedAt;

    private int kcal;
    private Map<String, NutrientResult> ratios;

    private List<IngredientDetail> ingredients;
    private List<TopRisk> topRisks;

    private String nutritionSummary;
    private String ingredientSummary;
}