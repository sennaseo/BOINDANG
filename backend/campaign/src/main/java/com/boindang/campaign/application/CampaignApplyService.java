package com.boindang.campaign.application;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;
import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignStatus;
import com.boindang.campaign.infrastructure.kafka.producer.KafkaCampaignProducer;
import com.boindang.campaign.infrastructure.redis.RedisApplicationStore;
import com.boindang.campaign.infrastructure.repository.CampaignRepository;
import com.boindang.campaign.presentation.dto.response.ApplyEvent;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampaignApplyService {

	private final RedisApplicationStore redisStore;
	private final KafkaCampaignProducer kafkaProducer;
	private final CampaignRepository campaignRepository;

	public ApplyResultResponse apply(Long campaignId, Long userId) {
		log.info("🔥 체험단 신청 시작: campaignId={}, userId={}", campaignId, userId);

		Campaign campaign = campaignRepository.findById(campaignId)
			.orElseThrow(() -> new CampaignException(ErrorCode.CAMPAIGN_NOT_FOUND));

		// 모집 상태 확인
		if (campaign.getStatus() != CampaignStatus.OPEN) {
			throw new CampaignException(ErrorCode.CAMPAIGN_NOT_OPEN);
		}

		// TTL 계산
		Duration ttl = Duration.between(LocalDateTime.now(), campaign.getEndDate());

		boolean isSelected = redisStore.tryApply(campaignId, userId, campaign.getCapacity(), ttl);

		log.info("✅ Redis 선처리 완료. 선정 여부: {}", isSelected);

		// Kafka 이벤트 발행
		ApplyEvent event = new ApplyEvent(campaignId, userId, isSelected);
		kafkaProducer.send("apply-campaign", event);

		log.info("✅ Kafka 메시지 발행 완료");

		return new ApplyResultResponse(campaignId, isSelected);
	}

}
