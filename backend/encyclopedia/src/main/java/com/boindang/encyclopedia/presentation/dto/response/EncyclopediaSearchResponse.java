package com.boindang.encyclopedia.presentation.dto.response;

import com.boindang.encyclopedia.domain.Encyclopedia;
import com.boindang.encyclopedia.domain.IngredientDictionary;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class EncyclopediaSearchResponse {
    private String id;
    private String name;
    private String engName;
    private String type;
    private String riskLevel;

    public static EncyclopediaSearchResponse from(IngredientDictionary entity) {
        return EncyclopediaSearchResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .engName(entity.getEngName())
                .type(entity.getType())
                .riskLevel(entity.getRiskLevel().getLabel()) // Enum 처리 주의
                .build();
    }

    public static EncyclopediaSearchResponse from2(Map<String, Object> src) {
        String rawRiskLevel = (String) src.get("riskLevel");
        String riskLabel = "정보 없음";
        try {
            riskLabel = IngredientDictionary.RiskLevel.valueOf(rawRiskLevel).getLabel();
        } catch (Exception ignored) {}

        return EncyclopediaSearchResponse.builder()
                .id((String) src.get("id"))
                .name((String) src.get("name"))
                .engName((String) src.get("engName"))
                .type((String) src.get("type"))
                .riskLevel(riskLabel)
                .build();
    }
    public static EncyclopediaSearchResponse from3(Encyclopedia entity) {
        return EncyclopediaSearchResponse.builder()
            .id(String.valueOf(entity.getId()))
            .name(entity.getName())
            .engName(entity.getEngName())
            .type(entity.getType())
            .riskLevel(entity.getRiskLevel().getLabel())
            .build();
    }
}
