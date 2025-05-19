package com.nutritionservice.nutrition.model.dto.external;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EncyclopediaRequest {
    private List<String> ingredients;
    private String userType;
}
