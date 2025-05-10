package com.boindanguser.common.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)  // ✅ null 값인 필드는 응답에서 제외
@JsonPropertyOrder({"success", "code", "message", "result"})  // ✅ JSON 필드 순서 고정
public class ApiResponse<T> {

    @JsonProperty("success")
    private final boolean success;

    private final int code;
    private final String message;
    private final T result;

    // ✅ 요청 성공 (result 포함)
    public static <T> ApiResponse<T> success(T result) {
        return new ApiResponse<>(true, 200, "요청에 성공하였습니다.", result);
    }

    // ✅ 요청 성공 (데이터 없이 성공 메시지만)
    public static ApiResponse<Void> success() {
        return new ApiResponse<>(true, 200, "요청에 성공하였습니다.", null);
    }

    // ✅ 요청 실패 (커스텀 에러 코드 & 메시지)
    public static <T> ApiResponse<T> fail(int code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }

    // ✅ 요청 실패 (`BaseResponseStatus` 사용)
    public static <T> ApiResponse<T> fail(ApiResponseStatus status) {
        return new ApiResponse<>(false, status.getCode(), status.getMessage(), null);
    }

    // ✅ `toString()` 오버라이드 (로그 출력 개선)
    @Override
    public String toString() {
        return "ApiResponse{" +
                "success=" + success +
                ", code=" + code +
                ", message='" + message + '\'' +
                (result != null ? ", result=" + result : "") +
                '}';
    }
}
