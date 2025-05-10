package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FatDetail {
    private Nutrient saturatedFat;
    private Nutrient transFat;
    private Nutrient unsaturatedFat;
}

