package com.boindanguser.common.exception.exception;

import com.boindanguser.common.model.dto.ApiResponseStatus;
import lombok.Getter;

@Getter
public class FileStorageException extends RuntimeException {
    private final ApiResponseStatus status;

    public FileStorageException(ApiResponseStatus status, Throwable cause) {
        super(status.getMessage(), cause);
        this.status = status;
    }
}