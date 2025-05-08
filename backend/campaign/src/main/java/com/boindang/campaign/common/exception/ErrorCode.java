package com.boindang.campaign.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    CAMPAIGN_NOT_FOUND(404, "해당 캠페인이 존재하지 않습니다."),
    CAMPAIGN_NOT_AVAILABLE(400, "현재 신청할 수 없는 캠페인입니다."),
    ALREADY_APPLIED(409, "이미 신청하신 캠페인입니다."),
	CAMPAIGN_CAPACITY_EXCEEDED(409, "모집 정원이 마감되었습니다."),
	KAFKA_SEND_FAILED(500, "Kafka 이벤트 전송 중 오류가 발생했습니다.");

	private final int code;
    private final String message;
}