package com.boindang.campaign.infrastructure.repository;

import com.boindang.campaign.domain.model.CampaignApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignApplicationRepository extends JpaRepository<CampaignApplication, Long> {
    boolean existsByCampaignIdAndUserId(Long campaignId, Long userId);
}
