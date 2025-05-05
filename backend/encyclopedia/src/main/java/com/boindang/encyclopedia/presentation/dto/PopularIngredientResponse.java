package com.boindang.encyclopedia.presentation.dto;

public record PopularIngredientResponse(
        String ingredientName,
        long count
) {}
