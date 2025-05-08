package com.boindang.campaign.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.campaign.application.CampaignApplyService;
import com.boindang.campaign.common.response.BaseResponse;
import com.boindang.campaign.infrastructure.kafka.producer.KafkaProducerService;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CampaignController {

	private final KafkaProducerService kafkaProducer;
	private final CampaignApplyService applyService;

	@GetMapping("/send")
	public ResponseEntity<String> sendMessage(@RequestParam String message) {
		kafkaProducer.send("test-topic", message);
		return ResponseEntity.ok("✅ 메시지 전송 완료!");
	}

	@PostMapping("/{campaignId}/apply")
	public BaseResponse<ApplyResultResponse> apply(@PathVariable Long campaignId, @RequestParam Long userId) {
		ApplyResultResponse result = applyService.apply(campaignId, userId);
		String message = result.isSelected() ? "체험단 신청이 완료되었습니다." : "정원이 마감되었습니다.";
		return BaseResponse.success(result.isSelected() ? 201 : 200, message, result);
	}
}

