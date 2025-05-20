package com.nutritionservice.nutrition.model.document;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CarbohydrateNutrient {
    private Double gram;
    private Double ratio;

    @Field("sub")
    private CarbDetail sub;
}
