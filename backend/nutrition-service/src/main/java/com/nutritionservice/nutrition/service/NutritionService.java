package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.client.EncyclopediaClient;
import com.nutritionservice.nutrition.client.UserClient;
import com.nutritionservice.nutrition.model.document.IngredientAnalysis;
import com.nutritionservice.nutrition.model.document.NutritionAnalysis;
import com.nutritionservice.nutrition.model.document.NutritionReport;
import com.nutritionservice.nutrition.model.document.ProductNutrition;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.EncyclopediaRequest;
import com.nutritionservice.nutrition.model.dto.external.EncyclopediaResponse;
import com.nutritionservice.nutrition.model.dto.external.IngredientDetail;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import com.nutritionservice.nutrition.repository.NutritionReportRepository;
import com.nutritionservice.nutrition.repository.ProductNutritionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NutritionService {

    private final ProductNutritionRepository productRepo;
    private final NutritionReportRepository reportRepo;
    private final UserTypeWarningService userTypeWarningService;
    private final WarningIngredientService warningIngredientService;
    private final EncyclopediaClient encyclopediaClient;

    @PostConstruct
    public void testEncyclopediaApi() {
        List<String> testIngredients = List.of("말티톨", "말토덱스트린", "스테비아");
        EncyclopediaRequest request = new EncyclopediaRequest(testIngredients, "dieter");
        String token = "Bearer eyJhbGciOiJIUzI1..."; // 실제 발급받은 토큰

        EncyclopediaResponse response = encyclopediaClient.getIngredientDetails(token, request);

        System.out.println("📘 백과사전 응답:");
        if (response != null && response.getData() != null) {
            response.getData().getIngredients().forEach(detail -> {
                System.out.printf("- %s | 위험도: %s | GI: %d | 메시지: %s\n",
                        detail.getName(),
                        detail.getRiskLevel(),
                        detail.getGi(),
                        detail.getShortMessage());
            });
        } else {
            System.out.println("❌ 응답이 null이거나 데이터가 없습니다. → response = " + response);
        }
    }

    public NutritionReport analyzeProductForUser(String userId, String productId) {
        System.out.println("productId: " + productId);
        System.out.println("전체 제품 목록:");
        productRepo.findAll().forEach(p -> System.out.println(p.getId() + " - " + p.getName()));

        ProductNutrition product = productRepo.findById(String.valueOf(new ObjectId(productId)))
                .orElseThrow(() -> new RuntimeException("해당 제품 없음"));

        if (product.getResult() == null || product.getResult().getNutrition_analysis() == null) {
            throw new RuntimeException("해당 제품에 영양 분석 정보가 없습니다.");
        }

        NutritionAnalysis na = product.getResult().getNutrition_analysis();
        IngredientAnalysis ia = product.getResult().getIngredient_analysis();

        UserInfo user = new UserInfo(userId, "F", 165, 60.0, "다이어트");
        Map<String, NutrientResult> ratios = AnalysisHelper.calculateRatios(product, user);
        List<String> userTypeWarnings = userTypeWarningService.generateWarnings(user, ratios);
        Map<String, String> warningIngredients = warningIngredientService.extractRiskIngredients(ia);

        String summary = "단백질은 적절하나 지방은 높습니다.";

        List<String> ingredientNames = warningIngredients.keySet().stream().toList();
        EncyclopediaRequest request = new EncyclopediaRequest(ingredientNames, user.getUserType());

        String token = "Bearer eyJhbGciOiJIUzI1..."; // 실제 발급받은 토큰
        EncyclopediaResponse encyclopediaResponse = encyclopediaClient.getIngredientDetails(token, request);
        List<IngredientDetail> ingredientWarnings = encyclopediaResponse.getData().getIngredients();

        NutritionReport report = NutritionReport.builder()
                .userId(userId)
                .productId(product.getId().toHexString())
                .productName(product.getName())
                .analyzedAt(LocalDateTime.now())
                .ratios(ratios)
                .ingredientWarnings(ingredientWarnings)
                .userTypeWarnings(userTypeWarnings)
                .summary(summary)
                .build();

        System.out.println("🚀 리포트 저장 또는 업데이트 시작 - 제품: " + product.getName());
        System.out.println("⚠ 성분 경고: " + ingredientWarnings);
        System.out.println("⚠ 사용자 경고: " + userTypeWarnings);

        try {
            Optional<NutritionReport> existing = reportRepo.findByUserId(userId).stream()
                    .filter(r -> r.getProductId().equals(product.getId().toHexString()))
                    .findFirst();

            if (existing.isPresent()) {
                report.setId(existing.get().getId());
                System.out.println("🔄 기존 리포트 업데이트: " + report.getProductName());
            } else {
                System.out.println("🆕 신규 리포트 저장: " + report.getProductName());
            }

            NutritionReport saved = reportRepo.save(report);
            System.out.println("✅ 리포트 저장 완료 - ID: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("❌ 리포트 저장 실패: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Mongo 저장 실패", e);
        }
    }
}
