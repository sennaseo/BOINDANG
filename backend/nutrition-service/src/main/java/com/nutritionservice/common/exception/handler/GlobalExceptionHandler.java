package com.nutritionservice.common.exception.handler;

import com.nutritionservice.common.exception.exception.BusinessException;
import com.nutritionservice.common.model.dto.ApiResponse;
import com.nutritionservice.common.model.dto.ApiResponseStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(0)
@Slf4j
public class GlobalExceptionHandler {

    // ✅ 비즈니스 예외 처리 (AOP에서 이미 로그 출력됨)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        return ResponseEntity.status(e.getApiResponseStatus().getHttpStatus())
                .body(ApiResponse.fail(e.getApiResponseStatus()));
    }

    // ✅ 잘못된 요청 예외 처리 (예: 입력값 검증 실패)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.fail(400, e.getMessage()));
    }

    // ✅ 예상치 못한 예외 처리 (서버 내부 오류)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception e) {
        return ResponseEntity.internalServerError()
                .body(ApiResponse.fail(500, "서버 오류가 발생했습니다."));
    }

    // ✅ 컨트롤러 메서드 실행전 오류는 AOP가 잡아낼 수 없으므로 여기서 직접 로그찍고 fail 반환
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        // 로그 남기고
        log.error("❌ JSON 역직렬화 실패: {}", e.getMessage());

        // BusinessException 형태로 포장해 통일
        return ResponseEntity
                .status(ApiResponseStatus.INVALID_JSON.getHttpStatus())
                .body(ApiResponse.fail(ApiResponseStatus.INVALID_JSON));
    }

}
