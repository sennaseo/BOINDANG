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
        NutritionReportResponse response = nutritionService.analyzeProductForUser(userId, productId);
        return ApiResponse.success(response);
    }
}
