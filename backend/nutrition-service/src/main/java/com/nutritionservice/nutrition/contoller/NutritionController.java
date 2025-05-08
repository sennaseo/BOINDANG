package com.nutritionservice.nutrition.contoller;

import com.nutritionservice.nutrition.model.document.NutritionReport;
import com.nutritionservice.nutrition.service.NutritionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nutrition")
@RequiredArgsConstructor
public class NutritionController {

    private final NutritionService nutritionService;

    @GetMapping("/analyze")
    public ResponseEntity<NutritionReport> analyze(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam String productId
    ) {
        return ResponseEntity.ok(nutritionService.analyzeProductForUser(userId, productId));
    }


}
