package com.boindang.quiz.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	QUIZ_NOT_FOUND(404, "해당 퀴즈를 찾을 수 없습니다."),
	OPTION_NOT_FOUND(404, "선택한 보기를 찾을 수 없습니다."),
	OPTION_QUIZ_MISMATCH(400, "선택한 보기는 해당 퀴즈에 속하지 않습니다."),
	INVALID_REQUEST(400, "잘못된 요청입니다."),
	INTERNAL_SERVER_ERROR(500, "서버 내부 오류가 발생했습니다.");

	private final int code;
	private final String message;
}
