package com.boindang.quiz.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.boindang.quiz.common.response.ApiResponses;
import com.boindang.quiz.common.response.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(QuizException.class)
	public ApiResponses<?> handleQuizException(Exception e) {
		return ApiResponses.error(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
	}

	@ExceptionHandler(QuizNotFoundException.class)
	public ApiResponses<?> handleNotFound(Exception e) {
		return ApiResponses.error(new ErrorResponse(HttpStatus.NOT_FOUND, e.getMessage()));
	}

	@ExceptionHandler(UserException.class)
	public ApiResponses<?> handleUserException(Exception e) {
		return ApiResponses.error(new ErrorResponse(HttpStatus.UNAUTHORIZED, e.getMessage()));
	}

	// 기타 예외 처리
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponses<String>> handleAllExceptions(Exception e) {
		log.info(e.getMessage());
		log.info(e.toString());
		return ResponseEntity.ok(
			ApiResponses.error(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage())));
	}
}
