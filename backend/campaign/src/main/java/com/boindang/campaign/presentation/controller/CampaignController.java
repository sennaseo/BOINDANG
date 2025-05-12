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
import com.boindang.campaign.common.response.BaseResponse;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;
import com.boindang.campaign.presentation.dto.response.CampaignDetailResponse;
import com.boindang.campaign.presentation.dto.response.CampaignSummaryResponse;
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
	public BaseResponse<List<CampaignSummaryResponse>> getCampaigns(
		@RequestParam(required = false) String status,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "0") int page
	){
		return BaseResponse.success(200, "체험단 목록 조회가 완료되었습니다."
			, campaignService.getCampaigns(status, size, page));
	}

	@Override
	@GetMapping("/{campaignId}")
	public BaseResponse<CampaignDetailResponse> getCampaignDetail(@PathVariable("campaignId") Long campaignId) {
		return BaseResponse.success(200, "체험단 상세 조회가 완료되었습니다."
			, campaignService.getCampaignDetail(campaignId));
	}

	@Override
	@PostMapping("/{campaignId}/apply")
	public BaseResponse<ApplyResultResponse> apply(
		@PathVariable("campaignId") Long campaignId,
		@RequestHeader("X-USER-ID") String userId
	) {
		ApplyResultResponse result = applyService.apply(campaignId, Long.parseLong(userId));
		String message = result.isSelected() ? "체험단 신청이 완료되었습니다." : "정원이 마감되었습니다.";
		return BaseResponse.success(result.isSelected() ? 201 : 200, message, result);
	}

	@Override
	@GetMapping("/my-applications")
	public BaseResponse<List<MyApplicationResponse>> getMyApplications(@RequestHeader("X-USER-ID") String userId) {
		return BaseResponse.success(200, "나의 체험단 신청 내역 조회가 왼료되었습니다."
			, campaignService.getMyApplications(Long.parseLong(userId)));
	}
}

