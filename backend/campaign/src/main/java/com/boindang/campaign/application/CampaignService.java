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
		// 전체 데이터 조회
		List<Campaign> allCampaigns = campaignRepository.findAll();

		// 상태 필터링
		List<Campaign> filtered = allCampaigns.stream()
			.filter(campaign -> {
				if (status == null) return true;
				return switch (status) {
					case "진행중" -> campaign.getStatus() == CampaignStatus.OPEN;
					case "모집 예정" -> campaign.getStatus() == CampaignStatus.PENDING;
					case "종료" -> campaign.getStatus() == CampaignStatus.CLOSED;
					default -> throw new IllegalArgumentException("유효하지 않은 상태입니다.");
				};
			})
			.toList();

		// 복합 정렬 로직
		List<Campaign> sorted = filtered.stream()
			.sorted(Comparator
				.comparing((Campaign c) -> {
					// 상태 우선순위 지정
					return switch (c.getStatus()) {
						case OPEN -> 0;
						case PENDING -> 1;
						case CLOSED -> 2;
					};
				})
				.thenComparing(c -> {
					// 상태별로 정렬 기준 다르게 적용
					return switch (c.getStatus()) {
						case OPEN, CLOSED -> c.getEndDate();
						case PENDING -> c.getStartDate();
					};
				})
			)
			.toList();

		// 수동 페이징
		int fromIndex = page * size;
		int toIndex = Math.min(fromIndex + size, sorted.size());
		List<CampaignSummaryResponse> pageContent = sorted.subList(fromIndex, toIndex).stream()
			.map(CampaignSummaryResponse::from)
			.toList();

		int totalPages = (int) Math.ceil((double) sorted.size() / size);

		return new CampaignListResponse(totalPages, pageContent);
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

