package com.boindang.community.common.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.boindang.community.dto.response.BaseResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(CommunityException.class)
	public BaseResponse<?> handleIngredientException(CommunityException e) {
		return BaseResponse.fail(e.getCode(), e.getMessage());
	}

	@ExceptionHandler(Exception.class)
	public BaseResponse<?> handleUnexpected(Exception e) {
		return BaseResponse.fail(500, e.getMessage());
	}

}
