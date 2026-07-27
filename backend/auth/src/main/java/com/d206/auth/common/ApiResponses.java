package com.d206.auth.common;

import lombok.Getter;
import lombok.Setter;

// 원본 커밋에서 누락돼 있던 클래스 — gateway의 dto.ApiResponses와 동일 구조로 복원 (2026-07-27)
@Getter
@Setter
public class ApiResponses<T> {
    private boolean isSuccess;
    private T data;
    private ErrorResponse error;

    public static <T> ApiResponses<T> success(T data) {
        ApiResponses<T> response = new ApiResponses<>();
        response.isSuccess = true;
        response.data = data;
        return response;
    }

    public static <T> ApiResponses<T> error(ErrorResponse errorResponse) {
        ApiResponses<T> response = new ApiResponses<>();
        response.isSuccess = false;
        response.error = errorResponse;
        return response;
    }
}
