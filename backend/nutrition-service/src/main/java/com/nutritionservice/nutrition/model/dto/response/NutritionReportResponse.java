package com.nutritionservice.nutrition.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionReportResponse {

    private String productName;
    private int totalKcal;

    private int estimatedGi;
    private String giGrade; // 안전 / 주의 / 위험

    private List<NutrientRatio> nutrientRatios;   // 탄단지 비율
    private List<NutrientDetail> nutrientDetails; // 각 성분 등급

    private List<IngredientWarning> ingredientWarnings; // 위험 성분 목록
    private List<String> userTypeWarnings;              // 사용자 유형 기반 경고 메시지

    private List<TopSensitiveIngredient> topSensitiveIngredients; // 우선순위 위험 성분

    // 내부 DTO 클래스들

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutrientRatio {
        private String name;     // ex: "탄수화물"
        private double percent;  // ex: 40.0
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutrientDetail {
        private String name;     // ex: "지방"
        private double value;    // ex: 14g
        private double percent;  // 권장 대비 %
        private String grade;    // 양호/주의/위험
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IngredientWarning {
        private String name;         // "말티톨"
        private String riskLevel;    // "주의"
        private String type;         // "당알코올 감미료"
        private String shortMessage; // "혈당 증가 우려"
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopSensitiveIngredient {
        private String name;    // "말토덱스트린"
        private String reason;  // "신장 환자 인산염 주의"
        private String rank;    // "1위"
    }
}
