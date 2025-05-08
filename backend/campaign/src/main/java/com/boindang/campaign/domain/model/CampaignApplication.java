package com.boindang.campaign.domain.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.boindang.campaign.presentation.dto.response.ApplyEvent;

import jakarta.persistence.Id;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CampaignApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long campaignId;
    private Long userId;
    private boolean isSelected;

    public static CampaignApplication of(ApplyEvent event) {
        CampaignApplication app = new CampaignApplication();
        app.campaignId = event.getCampaignId();
        app.userId = event.getUserId();
        app.isSelected = event.isSelected();
        return app;
    }

    public static CampaignApplication create(Campaign campaign, Long userId) {
        CampaignApplication app = new CampaignApplication();
        app.campaignId = campaign.getId();
        app.userId = userId;
        app.isSelected = true;  // 기본은 선정된 경우 (이벤트 발행 없이 저장할 경우 등)
        return app;
    }
}

