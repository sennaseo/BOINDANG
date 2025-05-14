package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.client.EncyclopediaClient;
import com.nutritionservice.nutrition.model.document.*;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.*;
import com.nutritionservice.nutrition.repository.NutritionReportRepository;
import com.nutritionservice.nutrition.repository.ProductNutritionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NutritionService {

    private final ProductNutritionRepository productRepo;
    private final NutritionReportRepository reportRepo;
    private final EncyclopediaClient encyclopediaClient;

//    @PostConstruct
//    public void testEncyclopediaApi() {
//        List<String> testIngredients = List.of("말티톨", "말토덱스트린", "스테비아");
//        EncyclopediaRequest request = new EncyclopediaRequest(testIngredients, "dieter");
//        String token = "Bearer eyJhbGciOiJIUzI1..."; // 실제 발급받은 토큰
//
//        EncyclopediaResponse response = encyclopediaClient.getIngredientDetails(token, request);
//
//        System.out.println("📘 백과사전 응답:");
//        if (response != null && response.getData() != null) {
//            response.getData().getIngredients().forEach(detail -> {
//                System.out.printf("- %s | 위험도: %s | GI: %d | 메시지: %s\n",
//                        detail.getName(),
//                        detail.getRiskLevel(),
//                        detail.getGi(),
//                        detail.getShortMessage());
//            });
//        } else {
//            System.out.println("❌ 응답이 null이거나 데이터가 없습니다. → response = " + response);
//        }
//    }

    public NutritionReport analyzeProductForUser(String userId, String productId) {
        // 1. 제품 조회
        ProductNutrition product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("해당 제품이 존재하지 않습니다."));

        // 2. 사용자 정보 (임시 하드코딩)
        UserInfo user = new UserInfo(userId, "F", 165, 60.0, "다이어트");

        // 3. 사용자 기준 영양소 비율/등급 계산
        Map<String, NutrientResult> ratios = AnalysisHelper.calculateRatios(product, user);

        // 4. 제품 성분 트리에서 전체 원재료 수집
        List<String> ingredientNames = new ArrayList<>();
        for (IngredientNode node : product.getResult().getIngredientAnalysis().getIngredientTree()) {
            collectIngredientNames(node, ingredientNames);
        }

        // 5. 백과사전 API 호출
        EncyclopediaRequest encyclopediaRequest = new EncyclopediaRequest(ingredientNames, user.getUserType());
        String token = "Bearer eyJhbGciOiJIUzI1...";  // 실제 토큰 입력 필요
        EncyclopediaResponse encyclopediaResponse = encyclopediaClient.getIngredientDetails(token, encyclopediaRequest);

        List<IngredientDetail> ingredientWarnings = encyclopediaResponse.getData().getIngredients();
        List<TopRisk> topRisks = encyclopediaResponse.getData().getTopRisks();

        // 6. 사용자 유형 경고 메시지
//        List<String> userTypeWarnings = userTypeWarningService.generateWarnings(user, ratios);

        // 7. 제품 분석 summary 저장
        Nutrition nutrition = product.getResult().getNutritionAnalysis().getNutrition();
        String nutritionSummary = product.getResult().getNutritionAnalysis().getNutritionSummary();
        String ingredientSummary = product.getResult().getIngredientAnalysis().getIngredientSummary();

        int kcal = product.getResult().getNutritionAnalysis().getNutrition().getKcal();

        // 8. NutritionReport 구성
        NutritionReport report = NutritionReport.builder()
                .userId(userId)
                .productId(productId)
                .productName(product.getName())
                .analyzedAt(LocalDateTime.now())
                .kcal(kcal)
                .ratios(ratios)
                .ingredients(ingredientWarnings)
                .topRisks(topRisks)
                .nutritionSummary(nutritionSummary)
                .ingredientSummary(ingredientSummary) // 추가
                .build();

        try {
            // 9. 기존 리포트 존재하면 update, 없으면 insert
            Optional<NutritionReport> existing = reportRepo.findByUserId(userId).stream()
                    .filter(r -> r.getProductId().equals(productId))
                    .findFirst();

            if (existing.isPresent()) {
                report.setId(existing.get().getId());
                System.out.println("🔄 기존 리포트 업데이트: " + product.getName());
            } else {
                System.out.println("🆕 신규 리포트 저장: " + product.getName());
            }

            NutritionReport saved = reportRepo.save(report);
            System.out.println("✅ 리포트 저장 완료 - ID: " + saved.getId());
            return saved;

        } catch (Exception e) {
            System.err.println("❌ 리포트 저장 실패: " + e.getMessage());
            throw new RuntimeException("Mongo 저장 실패", e);
        }
    }

    private void collectIngredientNames(IngredientNode node, List<String> result) {
        if (node.getName() != null) {
            result.add(node.getName());
        }
        if (node.getChildren() != null) {
            for (IngredientNode child : node.getChildren()) {
                collectIngredientNames(child, result);
            }
        }
    }

}
