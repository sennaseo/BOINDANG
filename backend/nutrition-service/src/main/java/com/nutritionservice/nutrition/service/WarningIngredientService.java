package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.model.document.IngredientAnalysis;
import com.nutritionservice.nutrition.model.document.IngredientNode;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WarningIngredientService {

    // 1. 성분별 위험 등급 정의
    private static final Map<String, String> ingredientRiskLevel = Map.of(
            "말티톨", "주의",
            "쇼트닝", "위험",
            "경화유", "위험",
            "아스파탐", "매우 위험",
            "수크랄로스", "위험",
            "과당", "주의",
            "트랜스지방", "매우 위험"
    );

    // 2. 사용자 유형별 민감 성분 정의
    private static final Map<String, List<String>> userTypeSensitiveIngredients = Map.of(
            "신장질환", List.of("경화유", "트랜스지방", "정제소금"),
            "다이어트", List.of("과당", "말티톨", "쇼트닝"),
            "당뇨병", List.of("아스파탐", "수크랄로스", "과당")
    );

    // 3. 전체 위험 성분 추출 (이름 + 등급)
    public Map<String, String> extractRiskIngredients(IngredientAnalysis analysis) {
        Map<String, String> found = new HashMap<>();
        for (IngredientNode node : analysis.getIngredientTree()) {
            traverseAndCollect(node, found);
        }
        return found;
    }

    // 4. 사용자 유형에 따라 민감한 성분만 필터링
    public List<String> extractUserTypeSensitiveOnly(Map<String, String> allFound, String userType) {
        List<String> sensitive = userTypeSensitiveIngredients.getOrDefault(userType, List.of());
        List<String> result = new ArrayList<>();
        for (String ing : allFound.keySet()) {
            if (sensitive.contains(ing)) {
                result.add(ing);
            }
        }
        return result;
    }

    // 5. 재귀 탐색
    private void traverseAndCollect(IngredientNode node, Map<String, String> found) {
        for (String risky : ingredientRiskLevel.keySet()) {
            if (node.getName().toLowerCase().contains(risky.toLowerCase())) {
                found.put(risky, ingredientRiskLevel.get(risky));
            }
        }

        if (node.getChildren() != null) {
            for (IngredientNode child : node.getChildren()) {
                traverseAndCollect(child, found);
            }
        }
    }
}
