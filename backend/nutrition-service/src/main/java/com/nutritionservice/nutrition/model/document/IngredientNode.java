package com.nutritionservice.nutrition.model.document;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientNode {
    private String name;
    private String origin;
    private Integer order;
    private List<IngredientNode> children;
}
