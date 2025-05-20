package com.boindang.encyclopedia.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RiskIngredientSummary {
	private String name; // 말토덱스트린
	private String keyword; // 신장
	private String title; // 인산염
	private String detail; // 신장질환자는 인산염이 ...
}

