package com.boindang.campaign.presentation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.campaign.application.CampaignApplyService;
import com.boindang.campaign.application.CampaignService;
import com.boindang.campaign.common.response.ApiResponses;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;
import com.boindang.campaign.presentation.dto.response.CampaignDetailResponse;
import com.boindang.campaign.presentation.dto.response.CampaignListResponse;
import com.boindang.campaign.presentation.dto.response.MyApplicationResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class CampaignController implements CampaignApi {

	private final CampaignApplyService applyService;
	private final CampaignService campaignService;

	@Override
	@GetMapping
	public ApiResponses<CampaignListResponse> getCampaigns(
		@RequestHeader("X-User-Id") String userId,
		@RequestParam(required = false) String status,
		@RequestParam(defaultValue = "5") int size,
		@RequestParam(defaultValue = "0") int page
	) {
		return ApiResponses.success(campaignService.getCampaigns(status, size, page, Long.parseLong(userId)));
	}

	@Override
	@GetMapping("/{campaignId}")
	public ApiResponses<CampaignDetailResponse> getCampaignDetail(
		@RequestHeader("X-User-Id") String userId,
		@PathVariable("campaignId") Long campaignId
	) {
		return ApiResponses.success(campaignService.getCampaignDetail(campaignId, Long.parseLong(userId)));
	}

	@Override
	@PostMapping("/{campaignId}/apply")
	public ApiResponses<ApplyResultResponse> apply(
		@PathVariable("campaignId") Long campaignId,
		@RequestHeader("X-User-Id") String userId
	) {
		return ApiResponses.success(applyService.apply(campaignId, Long.parseLong(userId)));
	}

	@Override
	@GetMapping("/my-applications")
	public ApiResponses<List<MyApplicationResponse>> getMyApplications(@RequestHeader("X-User-Id") String userId) {
		return ApiResponses.success(campaignService.getMyApplications(Long.parseLong(userId)));
	}
}

