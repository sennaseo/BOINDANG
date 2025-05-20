package com.nutritionservice.nutrition.model.document;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientAnalysis {
    private BasicInfo basicInfo;
    private List<IngredientNode> ingredientTree;
    private Map<String, List<String>> categorizedIngredients;
    private giInfo giIndex;
    private String summary;
}
