package com.boindang.encyclopedia.application.mapper;

import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaDetailResponse;

public class EncyclopediaMapper {

    public static EncyclopediaDetailResponse toDetailResponse(IngredientDictionary entity) {
        return EncyclopediaDetailResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .engName(entity.getEngName())
                .category(entity.getCategory())
                .type(entity.getType())
                .riskLevel(entity.getRiskLevel().getLabel())
                .gi(entity.getGi())
                .calories(entity.getCalories())
                .sweetness(entity.getSweetness())
                .description(entity.getDescription())
                .examples(entity.getExamples())
                .references(entity.getReferences())
                .bloodResponse(entity.getBloodResponse())
                .digestEffect(entity.getDigestEffect())
                .toothEffect(entity.getToothEffect())
                .pros(entity.getPros())
                .cons(entity.getCons())
                .diabetic(entity.getDiabetic())
                .kidneyPatient(entity.getKidneyPatient())
                .dieter(entity.getDieter())
                .muscleBuilder(entity.getMuscleBuilder())
                .recommendedDailyIntake(entity.getRecommendedDailyIntake())
                .regulatory(entity.getRegulatory())
                .issue(entity.getIssue())
                .compareTable(entity.getCompareTable())
                .build();
    }
}
