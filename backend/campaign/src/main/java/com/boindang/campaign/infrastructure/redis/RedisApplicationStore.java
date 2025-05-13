package com.boindang.campaign.infrastructure.redis;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RedisApplicationStore {

	private final StringRedisTemplate redisTemplate;

	public boolean tryApply(Long campaignId, Long userId, long limit, Duration ttl) {
		String userKey = "apply:users:" + campaignId;
		String countKey = "apply:count:" + campaignId;

		// 1. ttl 유효성 체크
		if (ttl == null || ttl.isNegative() || ttl.isZero()) {
			throw new CampaignException(ErrorCode.CAMPAIGN_NOT_AVAILABLE); // 캠페인 종료됨
		}

		// 2. 중복 신청 여부 확인
		Long added = redisTemplate.opsForSet().add(userKey, userId.toString());
		if (added == 0L) {
			throw new CampaignException(ErrorCode.ALREADY_APPLIED);
		}

		// 3. TTL 설정
		redisTemplate.expire(userKey, ttl);
		redisTemplate.expire(countKey, ttl);

		// 4. 현재 신청 수 증가 (atomic)
		Long currentCount = redisTemplate.opsForValue().increment(countKey);
		return currentCount <= limit;
	}
}
