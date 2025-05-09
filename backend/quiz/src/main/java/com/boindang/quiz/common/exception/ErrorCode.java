package com.boindang.quiz.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	QUIZ_NOT_FOUND(404, "해당 퀴즈가 존재하지 않습니다.");

	private final int code;
	private final String message;
}
