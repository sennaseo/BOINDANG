package com.boindang.campaign.infrastructure.repository;

import com.boindang.campaign.domain.model.Campaign;
import com.boindang.campaign.domain.model.CampaignStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
	Page<Campaign> findByStatus(CampaignStatus status, Pageable pageable);
}
