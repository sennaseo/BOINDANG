package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.domain.PopularIngredientBackup;
import com.boindang.encyclopedia.infrastructure.PopularIngredientBackupRepository;
import com.boindang.encyclopedia.presentation.dto.response.PopularIngredientResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PopularIngredientService {

    private final RedisTemplate<String, String> redisTemplate;
    private final PopularIngredientBackupRepository backupRepository;
    private final RestHighLevelClient client;
    private static final String POPULAR_INGREDIENT_KEY = "popular:ingredients";

    public String incrementSearchCount(String query) {
        if (existsByExactName(query)) {
            redisTemplate.opsForZSet().incrementScore(POPULAR_INGREDIENT_KEY, query, 1);
            redisTemplate.expire(POPULAR_INGREDIENT_KEY, Duration.ofDays(1));
            return "'" + query + "'이(가) 인기 검색어로 등록되었습니다.";
        }

        return "'" + query + "'은(는) 정확 일치 성분이 아니므로 저장되지 않았습니다.";
    }

    // TODO: 정확 일치 검색은 추후 Custom Repository로 분리 고려
    private boolean existsByExactName(String name) {
        SearchSourceBuilder builder = new SearchSourceBuilder()
            .query(QueryBuilders.termQuery("name.keyword", name)) // 정확한 일치만 탐색
            .size(1);

        SearchRequest request = new SearchRequest("ingredients").source(builder);

        try {
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            return response.getHits().getTotalHits().value > 0;
        } catch (IOException e) {
            log.error("❌ 인기 검색어를 위한 Elasticsearch 검색 실패", e);
            return false;
        }
    }

    public List<PopularIngredientResponse> getTopIngredients(int limit) {
        Set<ZSetOperations.TypedTuple<String>> result =
            redisTemplate.opsForZSet().reverseRangeWithScores(POPULAR_INGREDIENT_KEY, 0, limit - 1);

        log.info("🔥 redis result = {}", result);

        if (result != null && !result.isEmpty()) {
            return result.stream()
                .map(entry -> new PopularIngredientResponse(entry.getValue(), entry.getScore().longValue()))
                .collect(Collectors.toList());
        }

        // ✅ Redis에 없을 경우, 어제 날짜 기준으로 fallback
        LocalDate today = LocalDate.now();
        log.info("🩵 fallback to DB, date = {}", today);
        List<PopularIngredientBackup> backupList = backupRepository.findTopNByBackupDate(today, limit);

        return backupList.stream()
            .map(backup -> new PopularIngredientResponse(backup.getIngredientName(), backup.getScore()))
            .collect(Collectors.toList());
    }
}

