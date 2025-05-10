package com.nutritionservice.nutrition.model.dto.external;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private String id;
    private String gender;   // "M" or "F"
    private double height;   // cm
    private double weight;   // kg
    private String userType; // "다이어트", "근성장", "당뇨병", "신장질환"
}
