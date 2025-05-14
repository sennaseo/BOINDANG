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
import com.boindang.campaign.domain.service.CampaignApplicationPolicy;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

	private final CampaignRepository campaignRepository;
	private final CampaignApplicationRepository applicationRepository;
	private final CampaignApplicationPolicy campaignApplicationPolicy;

	public CampaignListResponse getCampaigns(String status, int size, int page, Long userId) {
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		List<Campaign> allCampaigns = campaignRepository.findAll();

		List<Campaign> filtered = allCampaigns.stream()
			.filter(campaign -> {
				CampaignStatus dynamicStatus = campaign.calculateStatus(now);
				if (status == null) return true;
				return switch (status) {
					case "진행중" -> dynamicStatus == CampaignStatus.OPEN;
					case "모집 예정" -> dynamicStatus == CampaignStatus.PENDING;
					case "종료" -> dynamicStatus == CampaignStatus.CLOSED;
					default -> throw new IllegalArgumentException("유효하지 않은 상태입니다.");
				};
			})
			.toList();

		List<Campaign> sorted = filtered.stream()
			.sorted(Comparator
				.comparing((Campaign c) -> {
					CampaignStatus s = c.calculateStatus(now);
					return switch (s) {
						case OPEN -> 0;
						case PENDING -> 1;
						case CLOSED -> 2;
					};
				})
				.thenComparing(c -> {
					CampaignStatus s = c.calculateStatus(now);
					return switch (s) {
						case OPEN, CLOSED -> c.getEndDate();
						case PENDING -> c.getStartDate();
					};
				})
			)
			.toList();

		int fromIndex = page * size;
		int toIndex = Math.min(fromIndex + size, sorted.size());

		List<CampaignSummaryResponse> pageContent = sorted.subList(fromIndex, toIndex).stream()
			.map(campaign -> {
				boolean isApplied = applicationRepository.existsByCampaignIdAndUserId(campaign.getId(), userId);
				return CampaignSummaryResponse.from(campaign, isApplied);
			})
			.toList();

		int totalPages = (int) Math.ceil((double) sorted.size() / size);

		return new CampaignListResponse(totalPages, pageContent);
	}

	@Transactional(readOnly = true)
	public CampaignDetailResponse getCampaignDetail(Long campaignId, Long userId) {
		Campaign campaign = campaignRepository.findById(campaignId)
			.orElseThrow(() -> new CampaignException(ErrorCode.CAMPAIGN_NOT_FOUND));

		campaign.getNotices().size(); // Lazy 초기화

		boolean isApplied = applicationRepository.existsByCampaignIdAndUserId(campaign.getId(), userId);
		return CampaignDetailResponse.from(campaign, isApplied);
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

