package com.nutritionservice.nutrition.mapper;

import com.nutritionservice.nutrition.model.document.NutritionReport;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import com.nutritionservice.nutrition.model.dto.response.NutritionReportResponse;
import lombok.experimental.UtilityClass;

import java.util.*;
import java.util.stream.Collectors;

@UtilityClass
public class NutritionReportMapper {

    public static NutritionReportResponse from(NutritionReport report, UserInfo user) {
        return NutritionReportResponse.builder()
                .productName(report.getProductName())
                .totalKcal((int) Math.round(
                        getValue(report, "탄수화물") * 4 +
                                getValue(report, "단백질") * 4 +
                                getValue(report, "지방") * 9))
                .estimatedGi(58)
                .giGrade("위험")
                .nutrientRatios(toRatios(report.getRatios()))
                .nutrientDetails(toDetails(report.getRatios()))

                .ingredientWarnings(report.getIngredientWarnings()) // ✅ 백과사전 기반 그대로 사용
                .userTypeWarnings(report.getUserTypeWarnings())
                .topSensitiveIngredients(List.of())
                .build();
    }

    private static double getValue(NutritionReport report, String key) {
        NutrientResult r = report.getRatios().get(key);
        return r != null ? r.getValue() : 0.0;
    }

    private static List<NutritionReportResponse.NutrientRatio> toRatios(Map<String, NutrientResult> ratios) {
        double total = getSafe(ratios, "탄수화물") + getSafe(ratios, "단백질") + getSafe(ratios, "지방");

        return List.of("탄수화물", "단백질", "지방").stream()
                .map(name -> NutritionReportResponse.NutrientRatio.builder()
                        .name(name)
                        .percent(Math.round(getSafe(ratios, name) / total * 1000.0) / 10.0)
                        .build())
                .collect(Collectors.toList());
    }

    private static List<NutritionReportResponse.NutrientDetail> toDetails(Map<String, NutrientResult> ratios) {
        return ratios.entrySet().stream()
                .map(entry -> NutritionReportResponse.NutrientDetail.builder()
                        .name(entry.getKey())
                        .value(entry.getValue().getValue())
                        .percent(entry.getValue().getPercent())
                        .grade(entry.getValue().getGrade())
                        .build())
                .collect(Collectors.toList());
    }

    private static double getSafe(Map<String, NutrientResult> ratios, String key) {
        NutrientResult r = ratios.get(key);
        return r != null ? r.getValue() : 0.0;
    }
}
