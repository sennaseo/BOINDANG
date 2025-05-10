package com.d206.imageservice.common;

import lombok.Getter;
import lombok.Setter;

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
