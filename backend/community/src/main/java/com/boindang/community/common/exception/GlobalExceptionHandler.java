package com.boindang.community.common.exception;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.context.support.DefaultMessageSourceResolvable;

import com.boindang.community.dto.response.BaseResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(CommunityException.class)
	public BaseResponse<?> handleIngredientException(CommunityException e) {
		return BaseResponse.fail(e.getCode(), e.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public BaseResponse<?> handleValidationException(MethodArgumentNotValidException ex) {
		// 가장 첫 번째 에러 메시지만 추출
		String message = ex.getBindingResult().getFieldErrors().stream()
			.findFirst()
			.map(DefaultMessageSourceResolvable::getDefaultMessage)
			.orElse("유효성 검사 실패");

		return BaseResponse.fail(400, message);
	}

	@ExceptionHandler(Exception.class)
	public BaseResponse<?> handleUnexpected(Exception e) {
		return BaseResponse.fail(500, e.getMessage());
	}

}
