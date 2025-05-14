package com.nutritionservice.nutrition.model.dto.response;

import com.nutritionservice.nutrition.model.dto.external.IngredientDetail;
import com.nutritionservice.nutrition.model.dto.external.TopRisk;
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

    private String productName; // 제품 이름
    private int kcal;           // 총 열량

    private int estimatedGi;    // 통합 GI
    private String giGrade;     // 안전 / 주의 / 위험

    private List<NutrientRatio> nutrientRatios;   // 탄단지 비율
    private List<NutrientDetail> nutrientDetails; // 각 성분 등급

    private List<IngredientDetail> ingredients;   // 원재료 정보 리스트
    private List<TopRisk> topRisks;               // 위험 리스트

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
}
