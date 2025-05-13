package com.boindang.encyclopedia.application.mapper;

import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaDetailResponse.CompareTable;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaDetailResponse.CompareTable.Row;

import java.util.List;
import java.util.stream.Collectors;

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
            .labels(entity.getLabels())
            .compareTable(
                CompareTable.builder()
                    .rows(mapRows(entity.getCompareTable().getRows()))
                    .build()
            )
            .build();
    }

    private static List<Row> mapRows(List<IngredientDictionary.CompareTable.Row> domainRows) {
        return domainRows.stream()
            .map(row -> Row.builder()
                .name(row.getName())
                .values(row.getValues())
                .build())
            .collect(Collectors.toList());
    }
}
