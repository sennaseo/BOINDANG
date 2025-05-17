package com.boindang.encyclopedia.infrastructure;

import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RedisAutocompleteSeeder {

	private final RedisTemplate<String, String> redisTemplate;

	@PostConstruct
	public void seed() {
		// ✅ 초성: ㅁ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅁ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅁ",
				"마그네슘", "말티톨", "말토덱스트린");
		}

		// ✅ 초성: ㅇ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅇ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅇ",
				"유청", "유화제", "에리스리톨", "옥수수전분");
		}

		// ✅ 초성: ㅂ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅂ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅂ",
				"비타민C", "베타카로틴", "비타민B1", "불포화지방산");
		}
	}
}
