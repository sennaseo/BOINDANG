package com.nutritionservice.nutrition.model.dto.external;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EncyclopediaResponse {

    private boolean isSuccess;
    private int code;
    private String message;
    private Data data;

    @Getter
    @Setter
    public static class Data {
        private List<IngredientDetail> ingredients;
        private List<TopRisk> topRisks;
    }

    @Getter
    @Setter
    public static class TopRisk {
        private String title;
        private String message;
    }
}
