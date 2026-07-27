package com.boindang.encyclopedia.common.exception;

import com.boindang.encyclopedia.common.response.ApiResponses;
import com.boindang.encyclopedia.common.response.ErrorResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ElasticSearchException.class)
    public ResponseEntity<ApiResponses<?>> handleElasticError(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponses.error(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage())));
    }

    @ExceptionHandler(InvalidIngredientQueryException.class)
    public ResponseEntity<ApiResponses<?>> handleInvalidCategory(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponses.error(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage())));
    }

    @ExceptionHandler(IngredientNotFoundException.class)
    public ResponseEntity<ApiResponses<?>> handleNotFound(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponses.error(new ErrorResponse(HttpStatus.NOT_FOUND, e.getMessage())));
    }

    // 기타 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponses<String>> handleAllExceptions(Exception e) {
        log.info(e.getMessage());
        log.info(e.toString());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ApiResponses.error(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage())));
    }
}