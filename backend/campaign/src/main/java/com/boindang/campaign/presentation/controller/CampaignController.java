package com.boindang.campaign.presentation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.campaign.application.CampaignApplyService;
import com.boindang.campaign.application.CampaignService;
import com.boindang.campaign.common.response.BaseResponse;
import com.boindang.campaign.infrastructure.kafka.producer.KafkaProducerService;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;
import com.boindang.campaign.presentation.dto.response.CampaignDetailResponse;
import com.boindang.campaign.presentation.dto.response.CampaignSummaryResponse;
import com.boindang.campaign.presentation.dto.response.MyApplicationResponse;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class CampaignController implements CampaignApi {

	private final KafkaProducerService kafkaProducer;
	private final CampaignApplyService applyService;
	private final CampaignService campaignService;

	@GetMapping("/send")
	public ResponseEntity<String> sendMessage(@RequestParam String message) {
		kafkaProducer.send("test-topic", message);
		return ResponseEntity.ok("✅ 메시지 전송 완료!");
	}

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
		@RequestParam Long userId
	) {
		ApplyResultResponse result = applyService.apply(campaignId, userId);
		String message = result.isSelected() ? "체험단 신청이 완료되었습니다." : "정원이 마감되었습니다.";
		return BaseResponse.success(result.isSelected() ? 201 : 200, message, result);
	}

	@Override
	@GetMapping("/my-applications")
	public BaseResponse<List<MyApplicationResponse>> getMyApplications(@RequestParam Long userId) {
		return BaseResponse.success(200, "나의 체험단 신청 내역 조회가 왼료되었습니다."
			, campaignService.getMyApplications(userId));
	}
}

