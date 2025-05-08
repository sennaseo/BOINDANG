package com.boindang.campaign.presentation.dto.response;

import java.time.LocalDate;

import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CampaignSummaryResponse {
	private Long id;
	private String name;
	private String imageUrl;
	private LocalDate deadline;
	private String status; // 모집 예정, 진행중, 종료

	public static CampaignSummaryResponse from(Campaign campaign) {
		return CampaignSummaryResponse.builder()
			.id(campaign.getId())
			.name(campaign.getName())
			.imageUrl(campaign.getImageUrl())
			.deadline(campaign.getEndDate().toLocalDate())
			.status(convertStatusToLabel(campaign.getStatus()))
			.build();
	}

	private static String convertStatusToLabel(CampaignStatus status) {
		return switch (status) {
			case PENDING -> "모집 예정";
			case OPEN -> "진행중";
			case CLOSED -> "종료";
		};
	}
}
