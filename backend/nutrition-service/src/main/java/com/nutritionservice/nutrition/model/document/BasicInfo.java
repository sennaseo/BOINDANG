package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BasicInfo {
    private String name;
    private Integer totalWeightGram;
    private Integer pakageGram;
    private Integer pakages;
}
