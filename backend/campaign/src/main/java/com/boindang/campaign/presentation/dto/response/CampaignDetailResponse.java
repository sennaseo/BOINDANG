package com.boindang.campaign.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CampaignDetailResponse {
	private Long id;
	private String name;
	private String content;
	private String mainCategory;
	private String subCategory;
	private String imageUrl;
	private LocalDateTime startDate;
	private LocalDateTime deadline;
	private String status;
	private int capacity;
	private int applicantCount;
	private List<String> hashtags;
	private List<String> notices;
	private boolean isApplied;

	public static CampaignDetailResponse from(Campaign campaign, boolean isApplied) {
		return CampaignDetailResponse.builder()
			.id(campaign.getId())
			.name(campaign.getName())
			.content(campaign.getDescription())
			.mainCategory(campaign.getMainCategory())
			.subCategory(campaign.getSubCategory())
			.imageUrl(campaign.getImageUrl())
			.startDate(campaign.getStartDate())
			.deadline(campaign.getEndDate())
			.status(convertStatusToLabel(campaign.getStatus()))
			.capacity(campaign.getCapacity())
			.applicantCount(campaign.getCurrentApplicants())
			.hashtags(campaign.getHashtags())
			.notices(campaign.getNotices())
			.isApplied(isApplied)
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
