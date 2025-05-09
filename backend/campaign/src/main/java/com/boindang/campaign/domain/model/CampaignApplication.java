package com.boindang.campaign.domain.model;

import java.time.LocalDateTime;

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

    private Long userId;
    private boolean isSelected;
    private LocalDateTime appliedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    public static CampaignApplication of(ApplyEvent event, Campaign campaign) {
        CampaignApplication app = new CampaignApplication();
        app.campaign = campaign;
        app.userId = event.getUserId();
        app.isSelected = event.isSelected();
        app.appliedAt = LocalDateTime.now();
        return app;
    }

}

