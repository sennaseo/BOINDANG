package com.boindang.encyclopedia.common.exception;

import com.boindang.encyclopedia.common.response.BaseResponse;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IngredientException.class)
    public BaseResponse<?> handleIngredientException(IngredientException e) {
        log.error("🩷 IngredientException occurred", e);
        return BaseResponse.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public BaseResponse<?> handleUnexpected(Exception e) {
        log.error("🩷 Unhandled (Global) exception", e);
        return BaseResponse.fail(500, e.getMessage());
    }
}