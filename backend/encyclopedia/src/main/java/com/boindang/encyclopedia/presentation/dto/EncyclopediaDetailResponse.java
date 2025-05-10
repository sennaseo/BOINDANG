package com.boindang.encyclopedia.presentation.dto;

import com.boindang.encyclopedia.domain.IngredientDictionary.CompareItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class EncyclopediaDetailResponse {

    private String id;
    private String name;
    private String engName;
    private String category;
    private String type;
    private String riskLevel;

    private int gi;
    private float calories;
    private float sweetness;

    private String description;
    private List<String> examples;
    private List<String> references;

    private String bloodResponse;
    private String digestEffect;
    private String toothEffect;
    private List<String> pros;
    private List<String> cons;

    private List<String> diabetic;
    private List<String> kidneyPatient;
    private List<String> dieter;
    private List<String> muscleBuilder;

    private int recommendedDailyIntake;
    private String regulatory;
    private String issue;
    private List<CompareItem> compareTable;
}
