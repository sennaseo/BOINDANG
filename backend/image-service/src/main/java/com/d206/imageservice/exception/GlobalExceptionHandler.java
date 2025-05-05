package com.d206.imageservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // @ExceptionHandler(ModelNotFoundException.class)
    // public ResponseEntity<String> handleException(ModelNotFoundException e) {
    //     return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    // }

    // 기타 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception e) {
        log.info(e.getMessage());
        log.info(e.toString());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
}
