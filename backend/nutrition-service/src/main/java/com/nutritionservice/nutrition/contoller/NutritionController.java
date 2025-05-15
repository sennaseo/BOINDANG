package com.nutritionservice.nutrition.contoller;

import com.nutritionservice.common.model.dto.ApiResponse;
import com.nutritionservice.nutrition.mapper.NutritionReportMapper;
import com.nutritionservice.nutrition.model.document.NutritionReport;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import com.nutritionservice.nutrition.model.dto.response.NutritionReportResponse;
import com.nutritionservice.nutrition.service.NutritionService;
import com.nutritionservice.nutrition.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class NutritionController {

    private final NutritionService nutritionService;

    @GetMapping("/analyze")
    public ApiResponse<NutritionReportResponse> analyze(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String productId
    ) {

//        UserInfo userInfo = userService.getUserById(userId);
//        NutritionReport report = nutritionService.analyzeProductForUser(userInfo, productId);

        System.out.println("analyze 함수 호출 ㅋ");

        NutritionReport report = nutritionService.analyzeProductForUser(userId, productId);
        System.out.println("📄 [분석 리포트 생성 완료]");
        System.out.println(" - 제품명: " + report.getProductName());
        System.out.println(" - 분석 시각: " + report.getAnalyzedAt());
        System.out.println(" - 열량(kcal): " + report.getKcal());
        System.out.println(" - 카테고리별 성분 수: " +
                (report.getCategorizedIngredients() != null ? report.getCategorizedIngredients().size() : 0));


        NutritionReportResponse response = NutritionReportMapper.from(report);
        return ApiResponse.success(response);
    }
}
