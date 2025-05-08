package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.model.document.NutritionAnalysis;
import com.nutritionservice.nutrition.model.document.ProductNutrition;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;

import java.util.*;

public class AnalysisHelper {

    public static Map<String, Double> getRecommendedValues(UserInfo user) {
        double weight = user.getWeight();
        return Map.of(
                "protein", weight * 1.6,
                "carbohydrate", weight * 4.0,
                "fat", weight * 0.9,
                "sodium", 2000.0
        );
    }

    public static Map<String, NutrientResult> calculateRatios(ProductNutrition product, UserInfo user) {
        Map<String, Double> recommended = getRecommendedValues(user);

        NutritionAnalysis na = product.getResult().getNutrition_analysis();

        Map<String, NutrientResult> result = new HashMap<>();

        double protein = na.getNutritionSummary().getProtein().getGram();
        double fat = na.getNutritionSummary().getFat().getGram();
        double carb = na.getNutritionSummary().getCarbohydrate().getGram();
        double sodium = na.getNutritionSummary().getSodium() != null
                ? na.getNutritionSummary().getSodium().getGram() : 0.0;

        result.put("protein", makeResult("protein", protein, recommended));
        result.put("fat", makeResult("fat", fat, recommended));
        result.put("carbohydrate", makeResult("carbohydrate", carb, recommended));
        result.put("sodium", makeResult("sodium", sodium, recommended));

        return result;
    }

    private static NutrientResult makeResult(String key, double actual, Map<String, Double> recommended) {
        double rec = recommended.getOrDefault(key, 1.0);
        double percent = (actual / rec) * 100;

        String grade;
        if (percent < 80) grade = "양호";
        else if (percent < 120) grade = "주의";
        else grade = "위험";

        return NutrientResult.builder()
                .value(actual)
                .percent(Math.round(percent * 10) / 10.0)
                .grade(grade)
                .build();
    }
}
