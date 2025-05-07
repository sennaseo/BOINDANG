package com.boindang.campaign.infrastructure.repository;

import com.boindang.campaign.domain.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignJpaRepository extends JpaRepository<Campaign, Long> {
}
