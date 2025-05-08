package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.client.UserClient;
import com.nutritionservice.nutrition.model.document.IngredientAnalysis;
import com.nutritionservice.nutrition.model.document.NutritionAnalysis;
import com.nutritionservice.nutrition.model.document.NutritionReport;
import com.nutritionservice.nutrition.model.document.ProductNutrition;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import com.nutritionservice.nutrition.repository.NutritionReportRepository;
import com.nutritionservice.nutrition.repository.ProductNutritionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static com.nutritionservice.nutrition.service.AnalysisHelper.calculateRatios;

@Service
@RequiredArgsConstructor
public class NutritionService {

    private final ProductNutritionRepository productRepo;
    private final NutritionReportRepository reportRepo;
//     private final UserClient userClient;

    public NutritionReport analyzeProductForUser(String userId, String productId) {
        // 1. 제품 정보 가져오기

        System.out.println("productId: " + productId);
        System.out.println("전체 제품 목록:");
        productRepo.findAll().forEach(p -> System.out.println(p.getId() + " - " + p.getName()));

        ProductNutrition product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("해당 제품 없음"));

        // ✅ result → nutrition_analysis → nutritionSummary
        if (product.getResult() == null || product.getResult().getNutrition_analysis() == null) {
            throw new RuntimeException("해당 제품에 영양 분석 정보가 없습니다.");
        }

        NutritionAnalysis na = product.getResult().getNutrition_analysis();
        IngredientAnalysis ia = product.getResult().getIngredient_analysis();

        // 2. 사용자 정보 (지금은 mock)
        UserInfo user = new UserInfo(userId, "F", 165, 60.0, "다이어트");

        // 3. 계산
        Map<String, NutrientResult> ratios = AnalysisHelper.calculateRatios(product, user);

        // TODO: 주의 성분, 타입별 경고, 요약
        List<String> warningIngredients = List.of("말티톨", "트랜스지방"); // 샘플
        List<String> userTypeWarnings = List.of("지방 섭취 주의");
        String summary = "단백질은 적절하나 지방은 높습니다.";

        // 4. 리포트 저장
        NutritionReport report = NutritionReport.builder()
                .userId(userId)
                .productId(product.getId())
                .productName(product.getName())
                .analyzedAt(LocalDateTime.now())
                .ratios(ratios)
                .warningIngredients(warningIngredients)
                .userTypeWarnings(userTypeWarnings)
                .summary(summary)
                .build();

        return reportRepo.save(report);
    }

}

