package com.boindang.community.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	FORBIDDEN_DELETE_POST(403, "해당 게시글의 삭제 권한이 없습니다.");

	private final int code;
	private final String message;
}

