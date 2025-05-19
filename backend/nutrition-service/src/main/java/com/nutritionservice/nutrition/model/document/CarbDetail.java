package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarbDetail {
    private Nutrient sugar;
    private Nutrient fiber;
}