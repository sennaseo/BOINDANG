package com.d206.auth.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

// 원본 커밋에서 누락돼 있던 클래스 — gateway의 dto.ErrorResponse와 동일 구조로 복원 (2026-07-27)
@AllArgsConstructor
@Getter
public class ErrorResponse {
    private final HttpStatus status;
    private final String message;
}
