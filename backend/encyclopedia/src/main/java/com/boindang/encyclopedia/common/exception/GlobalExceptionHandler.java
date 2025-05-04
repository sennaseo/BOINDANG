package com.boindang.encyclopedia.common.exception;

import com.boindang.encyclopedia.common.response.BaseResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IngredientException.class)
    public BaseResponse<?> handleIngredientException(IngredientException e) {
        return BaseResponse.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public BaseResponse<?> handleUnexpected(Exception e) {
        return BaseResponse.fail(500, "서버 내부 오류가 발생했습니다.");
    }
}