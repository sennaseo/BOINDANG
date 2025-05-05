package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.domain.PopularIngredientBackup;
import com.boindang.encyclopedia.infrastructure.PopularIngredientBackupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@Service
public class PopularIngredientBackupService { // 백업 및 데이터 정리용 서비스

    private final RedisTemplate<String, String> redisTemplate;
    private final PopularIngredientBackupRepository backupRepository;

    private static final String POPULAR_INGREDIENT_KEY = "popular:ingredients";

    public void backupAndClear() {
        Set<ZSetOperations.TypedTuple<String>> set =
                redisTemplate.opsForZSet().reverseRangeWithScores(POPULAR_INGREDIENT_KEY, 0, -1);

        if (set == null || set.isEmpty()) {
            log.info("✅ 백업할 인기 성분 없음");
            return;
        }

        LocalDate today = LocalDate.now();
        set.forEach(entry -> {
            backupRepository.save(PopularIngredientBackup.builder()
                    .ingredientName(entry.getValue())
                    .score(entry.getScore().longValue())
                    .backupDate(today)
                    .build());
        });

        redisTemplate.delete(POPULAR_INGREDIENT_KEY);
        log.info("✅ 인기 성분 백업 및 초기화 완료");
    }
}
