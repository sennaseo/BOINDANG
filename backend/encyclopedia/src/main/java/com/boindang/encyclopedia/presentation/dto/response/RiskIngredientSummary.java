package com.boindang.encyclopedia.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RiskIngredientSummary {
	private String title;
	private String message;
}

