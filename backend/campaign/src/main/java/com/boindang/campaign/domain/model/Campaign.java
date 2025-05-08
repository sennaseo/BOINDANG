package com.boindang.campaign.domain.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;                  // 공고명
    @Column(columnDefinition = "TEXT")
    private String description;            // 공고 설명

    private String mainCategory;          // 제품 대분류
    private String subCategory;          // 제품 소분류

    @ElementCollection
    @CollectionTable(name = "campaign_hashtags", joinColumns = @JoinColumn(name = "campaign_id"))
    @Column(name = "hashtag")
    private List<String> hashtags = new ArrayList<>();

    private int capacity;                  // 모집 인원
    private int currentApplicants = 0;     // 현재 신청 인원 수

    private String imageUrl;               // 제품 이미지

    @Enumerated(EnumType.STRING)
    private CampaignStatus status;         // 모집 상태 (예: OPEN)

    private LocalDateTime startDate;       // 오픈일
    private LocalDateTime endDate;         // 마감일

    @ElementCollection
    @CollectionTable(name = "campaign_notices", joinColumns = @JoinColumn(name = "campaign_id"))
    @Column(name = "notice")
    private List<String> notices = new ArrayList<>();  // 주의사항 리스트

    public Campaign(String name, String description, String mainCategory, String subCategory,
                    List<String> hashtags, int capacity, String imageUrl,
                    LocalDateTime startDate, LocalDateTime endDate, List<String> notices) {
        this.name = name;
        this.description = description;
        this.mainCategory = mainCategory;
        this.subCategory = subCategory;
        this.hashtags = hashtags;
        this.capacity = capacity;
        this.imageUrl = imageUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.notices = notices;
        this.status = CampaignStatus.PENDING;
    }

    public boolean isAvailable() {
        return status == CampaignStatus.OPEN &&
                LocalDateTime.now().isBefore(endDate);
    }

    public void increaseApplicant() {
        if (currentApplicants >= capacity) {
            throw new IllegalStateException("모집 정원이 초과되었습니다.");
        }
        this.currentApplicants++;
        if (currentApplicants == capacity) {
            this.status = CampaignStatus.CLOSED;
        }
    }

    public void updateStatusByDate() {
        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(startDate)) {
            this.status = CampaignStatus.PENDING;
        } else if (now.isAfter(endDate) || currentApplicants >= capacity) {
            this.status = CampaignStatus.CLOSED;
        } else {
            this.status = CampaignStatus.OPEN;
        }
    }

    public void close() {
        this.status = CampaignStatus.CLOSED;
    }
}

