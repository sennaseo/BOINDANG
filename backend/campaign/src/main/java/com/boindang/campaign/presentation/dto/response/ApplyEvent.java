package com.boindang.campaign.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplyEvent {
	private Long campaignId;
	private Long userId;
	private boolean isSelected;
}
