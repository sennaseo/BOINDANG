package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class giInfo {
    private int value;  // gi 지수
    private String grade;   // gi 등급
}
