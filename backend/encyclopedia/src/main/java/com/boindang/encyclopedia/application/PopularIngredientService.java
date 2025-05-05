package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.presentation.dto.PopularIngredientResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PopularIngredientService { // 실시간 API용 서비스

    private final RedisTemplate<String, String> redisTemplate;
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

        if (result == null) return Collections.emptyList();

        return result.stream()
                .map(entry -> new PopularIngredientResponse(entry.getValue(), entry.getScore().longValue()))
                .collect(Collectors.toList());
    }
}

