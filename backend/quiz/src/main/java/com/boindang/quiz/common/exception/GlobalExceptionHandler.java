package com.boindang.quiz.common.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.boindang.quiz.common.response.BaseResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(QuizException.class)
	public BaseResponse<?> handleQuizException(QuizException e) {
		return BaseResponse.fail(e.getCode(), e.getMessage());
	}

	@ExceptionHandler(Exception.class)
	public BaseResponse<?> handleUnexpected(Exception e) {
		return BaseResponse.fail(500, e.getMessage());
	}

}
