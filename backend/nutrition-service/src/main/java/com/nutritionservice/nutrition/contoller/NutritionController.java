package com.nutritionservice.nutrition.contoller;

import com.nutritionservice.common.model.dto.ApiResponse;
import com.nutritionservice.nutrition.mapper.NutritionReportMapper;
import com.nutritionservice.nutrition.model.document.NutritionReport;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import com.nutritionservice.nutrition.model.dto.response.NutritionReportResponse;
import com.nutritionservice.nutrition.service.NutritionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/nutrition")
@RequiredArgsConstructor
public class NutritionController {

    private final NutritionService nutritionService;

    @GetMapping("/analyze")
    public ApiResponse<NutritionReportResponse> analyze(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String productId
    ) {
        NutritionReport report = nutritionService.analyzeProductForUser(userId, productId);

        // TODO: 실제 유저 서비스 붙이면 userClient.getUserInfo(userId) 사용
        UserInfo mockUser = new UserInfo(userId, "F", 165, 60.0, "다이어트");

        NutritionReportResponse response = NutritionReportMapper.from(report, mockUser);
        return ApiResponse.success(response);
    }
}
