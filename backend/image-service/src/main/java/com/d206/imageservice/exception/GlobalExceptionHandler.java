package com.d206.imageservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.d206.imageservice.common.ApiResponses;
import com.d206.imageservice.common.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(InvalidFileTypeException.class)
	public ResponseEntity<ApiResponses<String>> handleException(InvalidFileTypeException e) {
		return ResponseEntity.ok(ApiResponses.error(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage())));
	}

	@ExceptionHandler(MissingFileTypeException.class)
	public ResponseEntity<ApiResponses<String>> handleException(MissingFileTypeException e) {
		return ResponseEntity.ok(ApiResponses.error(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage())));
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
