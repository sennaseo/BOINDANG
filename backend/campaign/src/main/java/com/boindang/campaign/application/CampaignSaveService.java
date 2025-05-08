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
		CampaignApplication application = CampaignApplication.of(event);
		applicationRepository.save(application);

		if (event.isSelected()) {
			Campaign campaign = campaignRepository.findById(event.getCampaignId())
				.orElseThrow(() -> new CampaignException(ErrorCode.CAMPAIGN_NOT_FOUND));
			campaign.increaseApplicant(); // DB의 신청자 수 증가
		}
	}
}
