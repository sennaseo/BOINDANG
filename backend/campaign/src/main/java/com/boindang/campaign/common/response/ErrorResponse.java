package com.boindang.campaign.common.response;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ErrorResponse {
	private final HttpStatus status;
	private final String message;
}
