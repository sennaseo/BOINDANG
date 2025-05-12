package com.boindang.campaign.presentation.dto.response;

import java.time.LocalDate;
import java.util.List;

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
	private String content;
	private String imageUrl;
	private LocalDate startDate;
	private LocalDate deadline;
	private String status; // 모집 예정, 진행중, 종료
	private int capacity;
	private List<String> hashtags;

	public static CampaignSummaryResponse from(Campaign campaign) {
		return CampaignSummaryResponse.builder()
			.id(campaign.getId())
			.name(campaign.getName())
			.content(campaign.getDescription())
			.imageUrl(campaign.getImageUrl())
			.startDate(campaign.getStartDate().toLocalDate())
			.deadline(campaign.getEndDate().toLocalDate())
			.status(convertStatusToLabel(campaign.getStatus()))
			.capacity(campaign.getCapacity())
			.hashtags(campaign.getHashtags())
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
