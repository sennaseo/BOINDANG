package com.nutritionservice.nutrition.model.dto.response;

import com.nutritionservice.nutrition.model.document.NutritionReport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionReportHistoryResponse {
    private String productId;
    private String productName;
    private LocalDateTime analyzedAt;

    public static NutritionReportHistoryResponse from(NutritionReport report) {
        return NutritionReportHistoryResponse.builder()
                .productId(report.getProductId())
                .productName(report.getProductName())
                .analyzedAt(report.getAnalyzedAt())
                .build();
    }
}
