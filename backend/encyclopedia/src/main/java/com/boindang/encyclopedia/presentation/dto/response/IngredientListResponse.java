package com.boindang.encyclopedia.presentation.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class IngredientListResponse {
	private int totalPages;
	private List<EncyclopediaSearchResponse> ingredients;
}
