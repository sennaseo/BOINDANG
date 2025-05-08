package com.boindang.campaign.application;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;
import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.infrastructure.kafka.producer.KafkaCampaignProducer;
import com.boindang.campaign.infrastructure.redis.RedisApplicationStore;
import com.boindang.campaign.infrastructure.repository.CampaignRepository;
import com.boindang.campaign.presentation.dto.response.ApplyEvent;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampaignApplyService {

	private final RedisApplicationStore redisStore;
	private final KafkaCampaignProducer kafkaProducer;
	private final CampaignRepository campaignRepository;

	public ApplyResultResponse apply(Long campaignId, Long userId) {
		Campaign campaign = campaignRepository.findById(campaignId)
			.orElseThrow(() -> new CampaignException(ErrorCode.CAMPAIGN_NOT_FOUND));

		LocalDateTime now = LocalDateTime.now();
		Duration ttl = Duration.between(now, campaign.getEndDate());

		boolean isSelected = redisStore.tryApply(campaignId, userId, campaign.getCapacity(), ttl);

		ApplyEvent event = new ApplyEvent(campaignId, userId, isSelected);
		kafkaProducer.send("apply-campaign", event);

		return new ApplyResultResponse(campaignId, isSelected);
	}
}
