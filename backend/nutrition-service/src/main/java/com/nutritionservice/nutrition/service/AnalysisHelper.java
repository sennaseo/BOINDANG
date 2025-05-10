package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.model.document.NutritionAnalysis;
import com.nutritionservice.nutrition.model.document.NutritionSummary;
import com.nutritionservice.nutrition.model.document.ProductNutrition;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;

import java.util.*;

public class AnalysisHelper {

    public static Map<String, Double> getRecommendedValues(UserInfo user) {
        double weight = user.getWeight();

        return Map.of(
                "protein", weight * 1.6,     // g
                "carbohydrate", weight * 4.0, // g
                "fat", weight * 0.9,          // g
                "sodium", 2.0,                // g (2000mg)
                "cholesterol", 0.3            // g (300mg)
        );
    }

    public static Map<String, NutrientResult> calculateRatios(ProductNutrition product, UserInfo user) {
        NutritionSummary ns = product.getResult().getNutrition_analysis().getNutritionSummary();
        Map<String, Double> recommended = getRecommendedValues(user);

        Map<String, NutrientResult> result = new HashMap<>();

        result.put("protein", makeResult("protein", ns.getProtein().getGram(), recommended));
        result.put("fat", makeResult("fat", ns.getFat().getGram(), recommended));
        result.put("carbohydrate", makeResult("carbohydrate", ns.getCarbohydrate().getGram(), recommended));

        if (ns.getSodium() != null) {
            double sodiumGram = ns.getSodium().getMg() != null
                    ? ns.getSodium().getMg() / 1000.0
                    : ns.getSodium().getGram(); // fallback
            result.put("sodium", makeResult("sodium", sodiumGram, recommended));
        }

        if (ns.getCholesterol() != null && ns.getCholesterol().getMg() != null) {
            double cholesterolGram = ns.getCholesterol().getMg() / 1000.0;
            result.put("cholesterol", makeResult("cholesterol", cholesterolGram, recommended));
        }

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
