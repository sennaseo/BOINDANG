package com.boindang.encyclopedia.presentation.dto;

import com.boindang.encyclopedia.domain.IngredientDictionary;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EncyclopediaSearchResponse {
    private String id;
    private String name;
    private String engName;
    private String category;
    private String riskLevel;

    public static EncyclopediaSearchResponse from(IngredientDictionary entity) {
        return EncyclopediaSearchResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .engName(entity.getEngName())
                .category(entity.getCategory())
                .riskLevel(entity.getRiskLevel().getLabel()) // Enum 처리 주의
                .build();
    }
}
