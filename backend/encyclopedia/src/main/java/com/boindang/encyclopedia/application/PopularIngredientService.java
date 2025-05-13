package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.domain.PopularIngredientBackup;
import com.boindang.encyclopedia.infrastructure.PopularIngredientBackupRepository;
import com.boindang.encyclopedia.presentation.dto.response.PopularIngredientResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PopularIngredientService { // 실시간 API용 서비스

    private final RedisTemplate<String, String> redisTemplate;
    private final PopularIngredientBackupRepository backupRepository;
    private static final String POPULAR_INGREDIENT_KEY = "popular:ingredients";

    public void incrementSearchCount(String ingredientName) {
        redisTemplate.opsForZSet().incrementScore(POPULAR_INGREDIENT_KEY, ingredientName, 1);

        if (Boolean.FALSE.equals(redisTemplate.hasKey(POPULAR_INGREDIENT_KEY))) {
            redisTemplate.expire(POPULAR_INGREDIENT_KEY, Duration.ofDays(1));
        }
    }

    public List<PopularIngredientResponse> getTopIngredients(int limit) {
        Set<ZSetOperations.TypedTuple<String>> result =
            redisTemplate.opsForZSet().reverseRangeWithScores(POPULAR_INGREDIENT_KEY, 0, limit - 1);

        if (result != null && !result.isEmpty()) {
            return result.stream()
                .map(entry -> new PopularIngredientResponse(entry.getValue(), entry.getScore().longValue()))
                .collect(Collectors.toList());
        }

        // ✅ Redis에 없을 경우, 어제 날짜 기준으로 fallback
        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<PopularIngredientBackup> backupList = backupRepository.findTopNByBackupDate(yesterday, limit);

        return backupList.stream()
            .map(backup -> new PopularIngredientResponse(backup.getIngredientName(), backup.getScore()))
            .collect(Collectors.toList());
    }
}

