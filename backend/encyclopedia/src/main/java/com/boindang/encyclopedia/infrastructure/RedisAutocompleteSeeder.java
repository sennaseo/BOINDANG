package com.boindang.encyclopedia.infrastructure;

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
		// ✅ 초성: ㄱ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㄱ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㄱ",
				"가공유지", "고과당콘시럽", "고지방분말", "구아검", "글루타민산 나트륨(MSG)", "글리세린", "기타가공품");
		}

		// ✅ 초성: ㄴ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㄴ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㄴ",
				"유청");
		}

		// ✅ 초성: ㄷ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㄷ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㄷ",
				"대두분", "덱스트린");
		}

		// ✅ 초성: ㄹ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㄹ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㄹ",
				"락툴로오스", "레시틴");
		}

		// ✅ 초성: ㅁ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅁ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅁ",
				"마그네슘", "말티톨", "말토덱스트린", "밀가루");
		}

		// ✅ 초성: ㅂ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅂ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅂ",
				"비타민 B12", "벤조산나트륨");
		}

		// ✅ 초성: ㅅ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅅ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅅ",
				"산도조절제", "설탕", "쇼트닝", "수크랄로스", "소르빈산칼륨", "스테비아");
		}

		// ✅ 초성: ㅇ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅇ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅇ",
				"아스파탐", "아세설팜칼륨", "아연", "아황산나트륨", "알룰로스", "옥배유", "올리고당", "유당", "유청", "유화제", "이눌린", "이산화규소", "이소말트", "인산염", "액상과당", "에리스리톨");
		}

		// ✅ 초성: ㅈ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅈ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅈ",
				"자일리톨", "정제소금");
		}

		// ✅ 초성: ㅊ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅊ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅊ",
				"철", "초산");
		}

		// ✅ 초성: ㅋ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅋ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅋ",
				"카라기난", "카복시메틸셀룰로오스나트륨", "카제인", "칼륨", "칼슘");
		}

		// ✅ 초성: ㅌ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅌ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅌ",
				"타가토스");
		}

		// ✅ 초성: ㅍ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅍ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅍ",
				"팜유", "프락토올리고당", "프로필렌글라이콜");
		}

		// ✅ 초성: ㅎ
		if (Boolean.FALSE.equals(redisTemplate.hasKey("autocomplete::ㅎ"))) {
			redisTemplate.opsForList().rightPushAll("autocomplete::ㅎ",
				"혼합분유", "효소제 NSC 5525", "향료", "헤즐넛페이스트");
		}
	}
}
