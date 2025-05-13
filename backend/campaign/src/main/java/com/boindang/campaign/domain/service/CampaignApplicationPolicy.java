package com.boindang.campaign.domain.service;

import com.boindang.campaign.common.annotation.DomainService;
import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;
import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.infrastructure.repository.CampaignApplicationRepository;
import lombok.RequiredArgsConstructor;

@DomainService
@RequiredArgsConstructor
public class CampaignApplicationPolicy {

    private final CampaignApplicationRepository applicationRepository;

    /**
     * 캠페인에 신청할 수 있는지 검증한다.
     *
     * @param campaign 신청 대상 캠페인
     * @param userId   신청자 ID
     * @throws CampaignException 신청 불가 상황에 대한 예외
     */
    public void validateApplication(Campaign campaign, Long userId) {
        // 1. 모집 기간 및 상태 확인
        campaign.updateStatusByDate();  // 현재 시간 기준으로 상태 갱신

        if (!campaign.isAvailable()) {
            throw new CampaignException(ErrorCode.CAMPAIGN_NOT_AVAILABLE);
        }

        // 2. 중복 신청 여부 확인
        boolean alreadyApplied = applicationRepository.existsByCampaignIdAndUserId(campaign.getId(), userId);
        if (alreadyApplied) {
            throw new CampaignException(ErrorCode.ALREADY_APPLIED);
        }

        // 인원 마감은 Campaign 엔티티 내에서 자체적으로 판단 & 예외 발생
    }
}
