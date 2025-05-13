package com.d206.auth.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.d206.auth.common.ApiResponses;
import com.d206.auth.common.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(JwtAuthenticationException.class)
	public ResponseEntity<Map<String, String>> handleInvalidateTokenException(Exception e) {
		Map<String, String> response = new HashMap<>();
		response.put("message", "토큰 검증 오류: " + e.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
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
