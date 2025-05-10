package com.boindang.campaign.common.exception;

public class CampaignException extends RuntimeException {

    private final ErrorCode errorCode;

    public CampaignException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public int getCode() {
        return errorCode.getCode();
    }
}

