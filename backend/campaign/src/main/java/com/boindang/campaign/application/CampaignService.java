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

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

	private final CampaignRepository campaignRepository;
	private final CampaignApplicationRepository applicationRepository;

	public CampaignListResponse getCampaigns(String status, int size, int page) {
		// 전체 목록을 불러오고
		List<Campaign> allCampaigns = campaignRepository.findAll();

		// 상태별로 필터링 및 정렬
		List<Campaign> sorted = allCampaigns.stream()
			.sorted(Comparator.comparing((Campaign c) -> {
				// 상태 우선순위: 진행중(0), 모집예정(1), 종료(2)
				return switch (c.getStatus()) {
					case OPEN -> 0;
					case PENDING -> 1;
					case CLOSED -> 2;
				};
			}).thenComparing(c -> {
				// 진행중 상태일 경우 마감일 빠른 순
				if (c.getStatus() == CampaignStatus.OPEN) {
					return c.getEndDate();
				} else {
					return LocalDateTime.MAX; // 나머지는 정렬 영향을 안 주게
				}
			}))
			.toList();

		// 페이징
		int fromIndex = page * size;
		int toIndex = Math.min(fromIndex + size, sorted.size());
		List<CampaignSummaryResponse> pagedList = sorted.subList(fromIndex, toIndex)
			.stream()
			.map(CampaignSummaryResponse::from)
			.toList();

		int totalPages = (int) Math.ceil((double) sorted.size() / size);

		return new CampaignListResponse(totalPages, pagedList);
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

