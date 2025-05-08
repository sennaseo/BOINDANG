package com.nutritionservice.nutrition.model.dto.analysis;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class NutrientResult {
    private double value;     // 실제 영양소 g or mg
    private double percent;   // 권장량 대비 비율 (ex: 75.5%)
    private String grade;     // 등급: "양호", "주의", "위험"
}
