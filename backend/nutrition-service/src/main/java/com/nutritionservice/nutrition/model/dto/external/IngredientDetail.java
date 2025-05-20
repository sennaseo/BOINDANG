package com.nutritionservice.nutrition.model.dto.external;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IngredientDetail {
    private String name;               // 성분 이름
    private int gi;                    // 혈당지수
    private String shortMessage;      // 짧은 요약 메시지
    private List<String> description; // 상세 설명
    private String riskLevel;         // 위험도 (ex: 권장, 주의, 위험, 매우위험)
}
