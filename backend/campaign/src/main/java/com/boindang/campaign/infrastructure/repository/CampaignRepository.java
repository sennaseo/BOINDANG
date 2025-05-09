package com.boindang.campaign.infrastructure.repository;

import java.util.List;

import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignStatus;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
	List<Campaign> findByStatus(CampaignStatus status, Pageable pageable);
}
