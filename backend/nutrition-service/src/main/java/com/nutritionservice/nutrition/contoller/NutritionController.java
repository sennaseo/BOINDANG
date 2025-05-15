package com.nutritionservice.nutrition.contoller;

import com.nutritionservice.common.model.dto.ApiResponse;
import com.nutritionservice.nutrition.model.dto.response.NutritionReportHistoryResponse;
import com.nutritionservice.nutrition.model.dto.response.NutritionReportResponse;
import com.nutritionservice.nutrition.service.NutritionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class NutritionController {

    private final NutritionService nutritionService;

    @GetMapping("/history")
    public ApiResponse<List<NutritionReportHistoryResponse>> history(
            @RequestHeader("X-User-Id") String userId
    ) {
        return ApiResponse.success(nutritionService.getUserReportHistory(userId));
    }

    @GetMapping("/history/{productId}")
    public ApiResponse<NutritionReportResponse> getDetailedReport(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String productId
    ) {
        return ApiResponse.success(nutritionService.getFullReportByProductId(userId, productId));
    }


    @GetMapping("/analyze")
    public ApiResponse<NutritionReportResponse> analyze(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String productId
    ) {

//        UserInfo userInfo = userService.getUserById(userId);
//        NutritionReport report = nutritionService.analyzeProductForUser(userInfo, productId);

        System.out.println("analyze 함수 호출 ㅋ");

        NutritionReportResponse response = nutritionService.analyzeProductForUser(userId, productId);
        System.out.println("📄 [분석 리포트 생성 완료]");
//        System.out.println(" - 제품명: " + report.getProductName());
//        System.out.println(" - 분석 시각: " + report.getAnalyzedAt());
//        System.out.println(" - 열량(kcal): " + report.getKcal());
//        System.out.println(" - 카테고리별 성분 수: " +
//                (report.getCategorizedIngredients() != null ? report.getCategorizedIngredients().size() : 0));


//        NutritionReportResponse response = NutritionReportMapper.from(report);
        return ApiResponse.success(response);
    }
}
