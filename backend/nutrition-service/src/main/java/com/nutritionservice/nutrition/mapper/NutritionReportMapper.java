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
                        report.getRatios().get("carbohydrate").getValue() * 4 +
                                report.getRatios().get("protein").getValue() * 4 +
                                report.getRatios().get("fat").getValue() * 9))
                .estimatedGi(58) // TODO: GI 계산 붙이면 교체
                .giGrade("위험")
                .nutrientRatios(toRatios(report.getRatios()))
                .nutrientDetails(toDetails(report.getRatios()))
                .ingredientWarnings(List.of()) // TODO: 성분 정보 연동 시 채움
                .userTypeWarnings(report.getUserTypeWarnings())
                .topSensitiveIngredients(List.of()) // TODO: 1~3위 위험 성분 추출 시 채움
                .build();
    }

    private static List<NutritionReportResponse.NutrientRatio> toRatios(Map<String, NutrientResult> ratios) {
        double total = ratios.get("carbohydrate").getValue()
                + ratios.get("protein").getValue()
                + ratios.get("fat").getValue();

        return List.of("carbohydrate", "protein", "fat").stream()
                .map(name -> NutritionReportResponse.NutrientRatio.builder()
                        .name(mapLabel(name))
                        .percent(Math.round(ratios.get(name).getValue() / total * 1000.0) / 10.0)
                        .build())
                .collect(Collectors.toList());
    }

    private static List<NutritionReportResponse.NutrientDetail> toDetails(Map<String, NutrientResult> ratios) {
        return ratios.entrySet().stream()
                .map(entry -> NutritionReportResponse.NutrientDetail.builder()
                        .name(mapLabel(entry.getKey()))
                        .value(entry.getValue().getValue())
                        .percent(entry.getValue().getPercent())
                        .grade(entry.getValue().getGrade())
                        .build())
                .collect(Collectors.toList());
    }

    private static String mapLabel(String key) {
        return switch (key) {
            case "carbohydrate" -> "탄수화물";
            case "protein" -> "단백질";
            case "fat" -> "지방";
            case "sodium" -> "나트륨";
            case "cholesterol" -> "콜레스테롤";
            default -> key;
        };
    }
}
