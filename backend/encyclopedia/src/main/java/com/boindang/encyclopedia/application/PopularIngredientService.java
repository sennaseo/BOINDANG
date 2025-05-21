package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.domain.PopularIngredientBackup;
import com.boindang.encyclopedia.infrastructure.EncyclopediaRepository;
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
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PopularIngredientService {

    private final RedisTemplate<String, String> redisTemplate;
    private final PopularIngredientBackupRepository backupRepository;
    private final EncyclopediaRepository encyclopediaRepository;
    private final RestHighLevelClient client;
    private static final String POPULAR_INGREDIENT_KEY = "popular:ingredients";

    public String incrementSearchCount(String query) {
        // 성분명(한글)이 정확히 일치하는 경우
        if (existsByExactName(query)) {

            // ✅ query = "말티톨" → ES에서 ID("maltitol") 조회
            Optional<IngredientDictionary> result = encyclopediaRepository.findByName(query).stream().findFirst();

            if (result.isPresent()) {
                String ingredientId = result.get().getId(); // ✅ 이거 추가!
                redisTemplate.opsForZSet().incrementScore(POPULAR_INGREDIENT_KEY, ingredientId, 1);
                redisTemplate.expire(POPULAR_INGREDIENT_KEY, Duration.ofDays(1));
                return "\"" + query + "\"(이)가 인기 검색어로 등록되었습니다.";
            }

            // 이름은 존재하지만 ID 조회 실패 시 fallback
            return "\"" + query + "\"의 ID를 찾을 수 없어 저장하지 않았습니다.";
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

        if (result != null && !result.isEmpty()) {
            List<String> ids = result.stream()
                .map(ZSetOperations.TypedTuple::getValue)
                .toList();

            List<IngredientDictionary> ingredients = encyclopediaRepository.findByIdIn(ids);
            log.info("📦 ES 조회 결과: {}", ingredients);

            Map<String, String> idToNameMap = ingredients.stream()
                .collect(Collectors.toMap(IngredientDictionary::getId, IngredientDictionary::getName));

            return result.stream()
                .map(entry -> {
                    String id = entry.getValue();
                    String name = idToNameMap.getOrDefault(id, "(이름없음)");
                    return new PopularIngredientResponse(id, name, entry.getScore().longValue());
                })
                .toList();
        }

    // ✅ Redis에 없을 경우, 어제 날짜 기준으로 fallback
        LocalDate today = LocalDate.now();
        List<PopularIngredientBackup> backupList = backupRepository.findTopNByBackupDate(today, limit);

        return backupList.stream()
            .map(backup -> new PopularIngredientResponse(
                backup.getIngredientId(),
                backup.getIngredientName(),
                backup.getScore()))
            .collect(Collectors.toList());
    }

}

