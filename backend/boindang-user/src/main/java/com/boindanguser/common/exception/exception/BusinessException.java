package com.boindanguser.common.exception.exception;

import com.boindanguser.common.model.dto.ApiResponseStatus;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final ApiResponseStatus apiResponseStatus;

    public BusinessException(ApiResponseStatus apiResponseStatus) {
        super(apiResponseStatus.getMessage());
        this.apiResponseStatus = apiResponseStatus;
    }
}
