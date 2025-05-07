package com.boindang.campaign.infrastructure.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RedisApplicationStore { // Redis를 통해 신청자 수 관리와 중복 신청 방지를 담당하는 인프라 계층

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 이미 신청한 유저인지 Redis 키로 확인
     */
    public boolean isAlreadyApplied(Long campaignId, Long userId) {
        String userKey = buildUserKey(campaignId, userId);
        return Boolean.TRUE.equals(redisTemplate.hasKey(userKey));
    }

    /**
     * Redis에 신청자 수 증가 + 중복 방지 키 등록 (TTL 포함)
     */
    public boolean tryApply(Long campaignId, Long userId, int capacity, Duration ttl) {
        String countKey = buildCountKey(campaignId);
        String userKey = buildUserKey(campaignId, userId);

        Long current = redisTemplate.opsForValue().increment(countKey);

        // Redis INCR 실패하거나 정원 초과 시 컷오프
        if (current == null || current > capacity) {
            redisTemplate.opsForValue().decrement(countKey); // 롤백
            return false;
        }

        // 중복 방지용 유저 키 등록
        redisTemplate.opsForValue().set(userKey, "1", ttl);
        return true;
    }

    /**
     * Redis 카운터 초기화 (필요 시 관리 기능에 사용)
     */
    public void resetCounter(Long campaignId) {
        redisTemplate.delete(buildCountKey(campaignId));
    }

    private String buildCountKey(Long campaignId) {
        return "campaign:apply:count:" + campaignId;
    }

    private String buildUserKey(Long campaignId, Long userId) {
        return "campaign:applied:" + campaignId + ":" + userId;
    }
}