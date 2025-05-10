package com.boindang.encyclopedia.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INGREDIENT_NOT_FOUND(404, "해당 성분을 찾을 수 없습니다.");

    private final int code;
    private final String message;
}
