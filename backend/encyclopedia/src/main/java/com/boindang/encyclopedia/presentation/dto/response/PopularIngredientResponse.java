package com.boindang.encyclopedia.presentation.dto.response;

public record PopularIngredientResponse(
		String ingredientId,
        String ingredientName,
        long count
) {}
