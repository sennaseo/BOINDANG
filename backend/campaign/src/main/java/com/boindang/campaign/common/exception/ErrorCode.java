package com.boindang.campaign.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    CAMPAIGN_NOT_FOUND(404, "해당 캠페인이 존재하지 않습니다."),
    CAMPAIGN_NOT_AVAILABLE(400, "현재 신청할 수 없는 캠페인입니다."),
    ALREADY_APPLIED(409, "이미 신청하신 캠페인입니다.");

	private final int code;
    private final String message;
}