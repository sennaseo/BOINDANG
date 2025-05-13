package com.boindang.campaign.application;

import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;
import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignStatus;
import com.boindang.campaign.infrastructure.repository.CampaignApplicationRepository;
import com.boindang.campaign.infrastructure.repository.CampaignRepository;
import com.boindang.campaign.presentation.dto.response.CampaignDetailResponse;
import com.boindang.campaign.presentation.dto.response.CampaignListResponse;
import com.boindang.campaign.presentation.dto.response.CampaignSummaryResponse;
import com.boindang.campaign.presentation.dto.response.MyApplicationResponse;

import org.springframework.data.domain.Page;
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
	private final CampaignApplicationRepository applicationRepository;

	public CampaignListResponse getCampaigns(String status, int size, int page) {
		Page<Campaign> pageResult;

		if (status == null) {
			pageResult = campaignRepository.findAll(PageRequest.of(page, size));
		} else {
			CampaignStatus statusEnum = switch (status) {
				case "모집 예정" -> CampaignStatus.PENDING;
				case "진행중" -> CampaignStatus.OPEN;
				case "종료" -> CampaignStatus.CLOSED;
				default -> throw new IllegalArgumentException("유효하지 않은 상태입니다.");
			};
			pageResult = campaignRepository.findByStatus(statusEnum, PageRequest.of(page, size));
		}

		List<CampaignSummaryResponse> campaigns = pageResult.getContent().stream()
			.map(CampaignSummaryResponse::from)
			.toList();

		return new CampaignListResponse(pageResult.getTotalPages(), campaigns);
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

	public List<MyApplicationResponse> getMyApplications(Long userId) {
		return applicationRepository.findWithCampaignByUserId(userId).stream()
			.map(app -> new MyApplicationResponse(
				app.getCampaign().getId(),
				app.getCampaign().getName(),
				app.isSelected(),
				app.getAppliedAt()
			))
			.collect(Collectors.toList());
	}

}

