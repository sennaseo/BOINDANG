package com.boindang.campaign.presentation.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CampaignListResponse {
	private int totalPages;
	private List<CampaignSummaryResponse> campaigns;
}
