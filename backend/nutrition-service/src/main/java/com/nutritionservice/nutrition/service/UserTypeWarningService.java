package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserTypeWarningService {

    private static final Map<String, List<String>> userTypeToSensitiveNutrients = Map.of(
            "신장질환", List.of("sodium", "cholesterol", "protein"),
            "당뇨병", List.of("carbohydrate", "sugar", "fat"),
            "다이어트", List.of("fat", "sugar", "calorie"),
            "근성장", List.of("fat", "carbohydrate") // 예시
    );

    private static final Map<String, String> nutrientDisplayName = Map.of(
            "sodium", "나트륨",
            "cholesterol", "콜레스테롤",
            "protein", "단백질",
            "carbohydrate", "탄수화물",
            "fat", "지방",
            "sugar", "당",
            "calorie", "칼로리"
    );

    public List<String> generateWarnings(UserInfo user, Map<String, NutrientResult> ratios) {
        String type = user.getUserType();
        List<String> sensitiveNutrients = userTypeToSensitiveNutrients.getOrDefault(type, List.of());

        List<String> warnings = new ArrayList<>();

        for (String nutrient : sensitiveNutrients) {
            NutrientResult result = ratios.get(nutrient);
            if (result != null && "위험".equals(result.getGrade())) {
                String label = nutrientDisplayName.getOrDefault(nutrient, nutrient);
                warnings.add("⚠ " + type + "자에게 " + label + "은 주의가 필요합니다.");
            }
        }

        return warnings;
    }
}
