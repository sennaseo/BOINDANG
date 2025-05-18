package com.boindang.encyclopedia.presentation.dto.response;

import java.util.List;

import com.boindang.encyclopedia.presentation.dto.response.IngredientReportResponse;
import com.boindang.encyclopedia.presentation.dto.response.RiskIngredientSummary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserReportResponse {
	private List<IngredientReportResponse> ingredients;
	private List<RiskIngredientSummary> topRisks;
}
