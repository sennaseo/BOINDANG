package com.boindang.campaign.presentation.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.campaign.application.ApplyForCampaignService;
import com.boindang.campaign.common.response.BaseResponse;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campaigns")
public class CampaignController implements CampaignApi {

	private final ApplyForCampaignService applyForCampaignService;

	@Override
	public BaseResponse<ApplyResultResponse> apply(@PathVariable Long campaignId, Long userId) {
		ApplyResultResponse result = applyForCampaignService.apply(campaignId, userId);
		String message = result.isSelected() ? "체험단 신청이 완료되었습니다." : "정원이 마감되었습니다.";
		return BaseResponse.success(result.isSelected() ? 201 : 200, message, result);
	}
}
