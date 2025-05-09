package com.boindang.campaign.common.exception;

import com.boindang.campaign.common.response.BaseResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CampaignException.class)
    public BaseResponse<?> handleIngredientException(CampaignException e) {
        return BaseResponse.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public BaseResponse<?> handleUnexpected(Exception e) {
        return BaseResponse.fail(500, e.getMessage());
    }

}
