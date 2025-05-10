package com.boindang.campaign.presentation.dto.response;

import java.time.LocalDateTime;

public record MyApplicationResponse(
	Long campaignId,
	String title,
	boolean isSelected,
	LocalDateTime appliedAt
) {}

