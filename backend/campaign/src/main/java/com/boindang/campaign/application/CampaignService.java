package com.boindang.campaign.application;

import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;
import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignStatus;
import com.boindang.campaign.infrastructure.repository.CampaignRepository;
import com.boindang.campaign.presentation.dto.response.CampaignDetailResponse;
import com.boindang.campaign.presentation.dto.response.CampaignSummaryResponse;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

	private final CampaignRepository campaignRepository;

	public List<CampaignSummaryResponse> getCampaigns(String status, int size, int page) {
		List<Campaign> campaigns;

		if (status == null) {
			campaigns = campaignRepository.findAll(PageRequest.of(page, size)).getContent();
		} else {
			CampaignStatus statusEnum = switch (status) {
				case "모집 예정" -> CampaignStatus.PENDING;
				case "진행중" -> CampaignStatus.OPEN;
				case "종료" -> CampaignStatus.CLOSED;
				default -> throw new IllegalArgumentException("유효하지 않은 상태입니다.");
			};
			campaigns = campaignRepository.findByStatus(statusEnum, PageRequest.of(page, size));
		}

		return campaigns.stream()
			.map(CampaignSummaryResponse::from)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public CampaignDetailResponse getCampaignDetail(Long campaignId) {
		Campaign campaign = campaignRepository.findById(campaignId)
			.orElseThrow(() -> new CampaignException(ErrorCode.CAMPAIGN_NOT_FOUND));

		// Lazy 초기화 트리거 ✅
		campaign.getNotices().size();

		campaign.updateStatusByDate(); // 상태 자동 갱신 (선택)
		return CampaignDetailResponse.from(campaign);
	}

}

