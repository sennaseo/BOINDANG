package com.nutritionservice.nutrition.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutritionservice.common.service.EurekaService;
import com.nutritionservice.nutrition.model.document.*;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.*;
import com.nutritionservice.nutrition.repository.NutritionReportRepository;
import com.nutritionservice.nutrition.repository.ProductNutritionRepository;
import com.nutritionservice.nutrition.util.UserTypeConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NutritionService {

    private final ProductNutritionRepository productRepo;
    private final NutritionReportRepository reportRepo;

    private final RestClient restClient;
    private final EurekaService eurekaService;

//    @PostConstruct
    public void testEncyclopediaApi() {
        List<String> testIngredients = List.of("말티톨", "말토덱스트린", "스테비아");
        EncyclopediaRequest request = new EncyclopediaRequest(testIngredients, "dieter");

//        EncyclopediaResponse response = encyclopediaClient.getIngredientDetails(token, request);

        EncyclopediaResponse response;

        try {
            String url = eurekaService.getUrl("ENCYCLOPEDIA") + "/encyclopedia/user-type";
            System.out.println("url: " + url);
            response = restClient.post()
                    .uri(url)
                    .header("X-User-Id", "1")
                    .body(request)
                    .retrieve()
                    .body(EncyclopediaResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("힝 이게 머노: " + e.getMessage(), e);
        }

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

    public NutritionReport analyzeProductForUser(UserInfo userInfo, String productId) {
        // 1. 제품 조회
        ProductNutrition product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("해당 제품이 존재하지 않습니다."));

        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(product);
//            System.out.println("📦 불러온 제품 전체 정보 (JSON):\n" + json);
        } catch (Exception e) {
            e.printStackTrace();
        }
        ProductResult result = product.getResult();

        if (result == null || result.getNutritionAnalysis() == null || result.getIngredientAnalysis() == null) {
            throw new RuntimeException("제품에 영양 또는 성분 분석 정보가 부족합니다.");
        }

        // 사용자 기준 영양소 비율/등급 계산
        Map<String, NutrientResult> ratios = AnalysisHelper.calculateRatios(product, userInfo);

        // 제품 성분 트리에서 전체 원재료 수집
        List<String> ingredientNames = new ArrayList<>();
        for (IngredientNode node : product.getResult().getIngredientAnalysis().getIngredientTree()) {
            collectIngredientNames(node, ingredientNames);
        }

        // 백과사전 API 호출
        String userType = UserTypeConverter.toEnglish(userInfo.getUserType());

        // 백과사전 requestDto
        EncyclopediaRequest encyclopediaRequest = new EncyclopediaRequest(ingredientNames, userType);

//        String token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsImlhdCI6MTc0NzExMzM3MiwiZXhwIjoxNzQ3MzcyNTcyfQ.MQNJBZGWVnwKebMxLSvW-dgKOblln1jwKvg5ieVyJ4M";  // 실제 토큰 입력 필요
//        EncyclopediaResponse encyclopediaResponse = encyclopediaClient.getIngredientDetails(token, encyclopediaRequest);

        // 백과사전 API 호출 (유레카)
        EncyclopediaResponse encyclopediaResponse;
        try {
            String url = eurekaService.getUrl("ENCYCLOPEDIA") + "/encyclopedia/user-type";
            System.out.println("🔗 백과사전 호출 URL: " + url);
            encyclopediaResponse = restClient.post()
                    .uri(url)
                    .header("X-User-Id", userInfo.getId())
                    .body(encyclopediaRequest)
                    .retrieve()
                    .body(EncyclopediaResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("📛 백과사전 호출 실패: " + e.getMessage(), e);
        }

        // 유효성 검증
        if (encyclopediaResponse == null || encyclopediaResponse.getData() == null) {
            throw new RuntimeException("📛 백과사전 응답이 null입니다.");
        }

        // 데이터 필드 검증
        List<IngredientDetail> allDetails = encyclopediaResponse.getData().getIngredients();
        List<TopRisk> topRisks = encyclopediaResponse.getData().getTopRisks();

        if (allDetails == null || allDetails.isEmpty()) {
            System.out.println("⚠️ 백과사전 성분 상세정보가 없습니다. → ingredientDetails=null");
            allDetails = new ArrayList<>();
        }

        if (topRisks == null || topRisks.isEmpty()) {
            System.out.println("⚠️ 우선순위 위험 성분 정보가 없습니다. → topRisks=null");
            topRisks = new ArrayList<>();
        }


        // 6. 원재료 용도별로 분리하여 매핑
        Map<String, List<String>> categorized = product.getResult()
                .getIngredientAnalysis()
                .getCategorizedIngredients();

        Map<String, List<IngredientDetail>> categorizedMap = new LinkedHashMap<>();

        List<String> orderedCategories = List.of(
                "감미료", "산도조절제", "유화제", "점질제", "착향료", "착색료", "보존제", "산화방지제", "팽창제", "기타"
        );

        for (String category : orderedCategories) {
            List<String> namesInCategory = categorized.getOrDefault(category, List.of());

            List<IngredientDetail> matched = new ArrayList<>();
            for (String name : namesInCategory) {
                allDetails.stream()
                        .filter(detail -> detail.getName().equals(name))
                        .findFirst()
                        .ifPresent(matched::add);
            }
            categorizedMap.put(category, matched);
        }


        // 7. 제품 분석 summary 저장
//        Nutrition nutrition = product.getResult().getNutritionAnalysis().getNutrition();
        String nutritionSummary = product.getResult().getNutritionAnalysis().getSummary();
        String ingredientSummary = product.getResult().getIngredientAnalysis().getSummary();

        int kcal = product.getResult().getNutritionAnalysis().getNutrition().getKcal();

        // 8. NutritionReport 구성
        NutritionReport report = NutritionReport.builder()
                .userId(userInfo.getId())
                .productId(productId)
                .productName(product.getName())
                .analyzedAt(LocalDateTime.now())
                .kcal(kcal)
                .ratios(ratios)
                .categorizedIngredients(categorizedMap)
                .topRisks(topRisks)
                .nutritionSummary(nutritionSummary)
                .ingredientSummary(ingredientSummary) // 추가
                .build();

        try {
            // 9. 기존 리포트 존재하면 update, 없으면 insert
            Optional<NutritionReport> existing = reportRepo.findByUserId(userInfo.getId()).stream()
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
