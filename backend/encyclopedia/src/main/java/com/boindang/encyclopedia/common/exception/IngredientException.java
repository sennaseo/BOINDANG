package com.boindang.encyclopedia.common.exception;

import lombok.Getter;

@Getter
public class IngredientException extends RuntimeException {
    public IngredientException(String message) {
        super(message);
    }
}
