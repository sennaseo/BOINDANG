package com.boindang.encyclopedia.presentation.dto.response;

public record PopularIngredientResponse(
        String ingredientName,
        long count
) {}
