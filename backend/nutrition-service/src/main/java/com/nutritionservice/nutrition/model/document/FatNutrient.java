package com.nutritionservice.nutrition.model.document;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FatNutrient {
    private Double gram;
    private Double ratio;

    @Field("sub")
    private FatDetail sub;
}
