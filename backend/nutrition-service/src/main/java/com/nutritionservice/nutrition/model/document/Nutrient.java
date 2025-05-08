package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nutrient {
    private double gram;
    private double ratio;
    private FatDetail sub; // optional: fat에만 존재
}
