package com.boindang.encyclopedia.common.exception;

import lombok.Getter;

@Getter
public class IngredientException extends RuntimeException {

    private final ErrorCode errorCode;

    public IngredientException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public int getCode() {
        return errorCode.getCode();
    }
}
