package com.boindang.campaign.application;

import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;
import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignApplication;
import com.boindang.campaign.domain.service.CampaignApplicationPolicy;
import com.boindang.campaign.infrastructure.redis.RedisApplicationStore;
import com.boindang.campaign.infrastructure.repository.CampaignApplicationRepository;
import com.boindang.campaign.infrastructure.repository.CampaignJpaRepository;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApplyForCampaignService {

    private final CampaignJpaRepository campaignRepository;
    private final CampaignApplicationRepository applicationRepository;
    private final CampaignApplicationPolicy campaignApplicationPolicy;
    private final RedisApplicationStore redisApplicationStore;

    @Transactional
    public ApplyResultResponse apply(Long campaignId, Long userId) {
        // 1. Campaign 조회
        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new CampaignException(ErrorCode.CAMPAIGN_NOT_FOUND));

        // 2. TTL 동적 계산: now ~ endDate
        LocalDateTime now = LocalDateTime.now();
        Duration ttl = Duration.between(now, campaign.getEndDate());

        // 3. 마감 지났을 경우(ttl이 음수이거나 0) 예외 처리
        if (ttl.isNegative() || ttl.isZero()) {
            throw new CampaignException(ErrorCode.CAMPAIGN_NOT_AVAILABLE);
        }

        // 4. Redis 중복 신청 확인
        if (redisApplicationStore.isAlreadyApplied(campaignId, userId)) {
            throw new CampaignException(ErrorCode.ALREADY_APPLIED);
        }

        // 5. 도메인 정책 검증 (기간/상태/DB 중복 등)
        campaignApplicationPolicy.validateApplication(campaign, userId);

        // 6. Redis 선착순 처리
        boolean applied = redisApplicationStore.tryApply(campaignId, userId, campaign.getCapacity(), ttl);
        if (!applied) {
            return new ApplyResultResponse(campaignId, false);
        }

        // 7. 신청자 수 증가 (엔티티 자체 상태 반영용)
        campaign.increaseApplicant();

        // 8. 신청자 수 증가 및 저장
        campaign.increaseApplicant();
        CampaignApplication application = CampaignApplication.create(campaign, userId);
        applicationRepository.save(application);

        // 9. 성공 응답
        return new ApplyResultResponse(campaignId, true);
    }
}
