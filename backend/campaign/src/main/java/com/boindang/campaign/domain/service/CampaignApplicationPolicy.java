package com.boindang.campaign.domain.service;

import java.time.LocalDateTime;
import java.time.ZoneId;

import com.boindang.campaign.common.annotation.DomainService;
import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;
import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignStatus;
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
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));

        // 1. 모집 기간 상태 확인 (startDate/endDate 기준)
        CampaignStatus currentStatus = campaign.calculateStatus(now);
        if (currentStatus != CampaignStatus.OPEN) {
            throw new CampaignException(ErrorCode.CAMPAIGN_NOT_AVAILABLE); // "진행 중이 아닙니다"
        }

        // 2. 정원 초과 여부 체크
        if (campaign.getCurrentApplicants() >= campaign.getCapacity()) {
            throw new CampaignException(ErrorCode.CAMPAIGN_CAPACITY_EXCEEDED); // "모집 인원이 모두 찼습니다"
        }

        // 3. 중복 신청 여부 확인
        if (userId != null && applicationRepository.existsByCampaignIdAndUserId(campaign.getId(), userId)) {
            throw new CampaignException(ErrorCode.ALREADY_APPLIED); // "이미 신청한 캠페인입니다"
        }
    }
}

