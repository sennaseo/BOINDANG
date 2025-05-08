package com.boindang.campaign.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;
import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignApplication;
import com.boindang.campaign.infrastructure.repository.CampaignApplicationRepository;
import com.boindang.campaign.infrastructure.repository.CampaignRepository;
import com.boindang.campaign.presentation.dto.response.ApplyEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CampaignSaveService {

	private final CampaignApplicationRepository applicationRepository;
	private final CampaignRepository campaignRepository;

	public void save(ApplyEvent event) {
		// 1. Campaign 조회
		Campaign campaign = campaignRepository.findById(event.getCampaignId())
			.orElseThrow(() -> new CampaignException(ErrorCode.CAMPAIGN_NOT_FOUND));

		// 2. CampaignApplication 생성 (연관 객체 전달)
		CampaignApplication application = CampaignApplication.of(event, campaign);
		System.out.println(">>> Campaign ID before save: " + campaign.getId());
		applicationRepository.save(application);

		// 3. 선정된 경우만 신청자 수 증가
		if (event.isSelected()) {
			campaign.increaseApplicant(); // DB 반영
		}
	}

}
