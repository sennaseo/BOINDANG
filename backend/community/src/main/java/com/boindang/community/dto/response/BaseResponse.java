package com.boindang.community.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({ "isSuccess", "code", "message", "data" })
public class BaseResponse<T> {

	@JsonProperty("isSuccess")
	private boolean success;
	private int code;
	private String message;
	private T data;

	// 성공 응답용 정적 메서드
	public static <T> BaseResponse<T> success(int code, String message, T data) {
		return new BaseResponse<>(true, code, message, data);
	}

	// 실패 응답용 정적 메서드
	public static <T> BaseResponse<T> fail(int code, String message) {
		return new BaseResponse<>(false, code, message, null);
	}
}