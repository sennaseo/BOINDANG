package com.boindang.community.common.exception;

public class CommunityException extends RuntimeException {

	private final ErrorCode errorCode;

	public CommunityException(ErrorCode errorCode) {
		super(errorCode.getMessage());
		this.errorCode = errorCode;
	}

	public int getCode() {
		return errorCode.getCode();
	}
}
