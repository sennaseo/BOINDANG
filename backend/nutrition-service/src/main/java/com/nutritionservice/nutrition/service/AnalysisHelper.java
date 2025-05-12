package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.model.document.NutritionAnalysis;
import com.nutritionservice.nutrition.model.document.NutritionSummary;
import com.nutritionservice.nutrition.model.document.ProductNutrition;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import com.nutritionservice.nutrition.util.NutrientGradeRule;
import com.nutritionservice.nutrition.util.NutrientGradeRule.UserType;

import java.util.*;

public class AnalysisHelper {

    public static Map<String, NutrientResult> calculateRatios(ProductNutrition product, UserInfo user) {
        NutritionSummary ns = product.getResult().getNutrition_analysis().getNutritionSummary();
        UserType userType = UserType.valueOf(user.getUserType());

        Map<String, NutrientResult> result = new HashMap<>();

        result.put("protein", makeResult("protein", ns.getProtein().getGram(), ns.getProtein().getRatio(), userType));
        result.put("fat", makeResult("fat", ns.getFat().getGram(), ns.getFat().getRatio(), userType));
        result.put("carbohydrate", makeResult("carbohydrate", ns.getCarbohydrate().getGram(), ns.getCarbohydrate().getRatio(), userType));

        if (ns.getSodium() != null) {
            double sodiumGram = ns.getSodium().getMg() != null
                    ? ns.getSodium().getMg() / 1000.0
                    : ns.getSodium().getGram();
            double sodiumRatio = ns.getSodium().getRatio();
            result.put("sodium", makeResult("sodium", sodiumGram, sodiumRatio, userType));
        }

        if (ns.getCholesterol() != null && ns.getCholesterol().getMg() != null) {
            double cholesterolGram = ns.getCholesterol().getMg() / 1000.0;
            double cholesterolRatio = ns.getCholesterol().getRatio();
            result.put("cholesterol", makeResult("cholesterol", cholesterolGram, cholesterolRatio, userType));
        }

        if (ns.getFat() != null && ns.getFat().getSub() != null) {
            if (ns.getFat().getSub().getSaturatedFat() != null) {
                result.put("포화지방", makeResult(
                        "saturatedFat",
                        ns.getFat().getSub().getSaturatedFat().getGram(),
                        ns.getFat().getSub().getSaturatedFat().getRatio(),
                        userType
                ));
            }
            if (ns.getFat().getSub().getTransFat() != null) {
                result.put("트랜스지방", makeResult(
                        "transFat",
                        ns.getFat().getSub().getTransFat().getGram(),
                        ns.getFat().getSub().getTransFat().getRatio(),
                        userType
                ));
            }
        }

        System.out.println("✅ 계산된 영양 비율 결과:");
        for (Map.Entry<String, NutrientResult> entry : result.entrySet()) {
            System.out.printf("- %s: %.1fg / %.1f%% → 등급: %s\n",
                    entry.getKey(),
                    entry.getValue().getValue(),
                    entry.getValue().getPercent(),
                    entry.getValue().getGrade());
        }

        return result;
    }

    private static NutrientResult makeResult(String key, double actual, double percent, UserType userType) {
        String grade = NutrientGradeRule.getGrade(key, userType, percent);

        return NutrientResult.builder()
                .value(actual)
                .percent(Math.round(percent * 10) / 10.0)
                .grade(grade)
                .build();
    }
}
