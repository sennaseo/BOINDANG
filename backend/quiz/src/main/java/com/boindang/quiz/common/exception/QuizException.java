package com.boindang.quiz.common.exception;

public class QuizException extends RuntimeException {

	private final ErrorCode errorCode;

	public QuizException(ErrorCode errorCode) {
		super(errorCode.getMessage());
		this.errorCode = errorCode;
	}

	public int getCode() {
		return errorCode.getCode();
	}

}
