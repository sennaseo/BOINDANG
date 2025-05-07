package com.boindang.campaign.domain.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import jakarta.persistence.Id;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CampaignApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Campaign campaign;

    private Long userId;

    private LocalDateTime appliedAt;

    private boolean selected = false;

    private CampaignApplication(Campaign campaign, Long userId) {
        this.campaign = campaign;
        this.userId = userId;
        this.appliedAt = LocalDateTime.now();
        this.selected = false;
    }

    public static CampaignApplication create(Campaign campaign, Long userId) {
        return new CampaignApplication(campaign, userId);
    }

    public void select() {
        this.selected = true;
    }

    public void unselect() {
        this.selected = false;
    }

}

