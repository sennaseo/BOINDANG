package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.application.mapper.EncyclopediaMapper;
import com.boindang.encyclopedia.common.exception.ErrorCode;
import com.boindang.encyclopedia.common.exception.IngredientException;
import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.infrastructure.EncyclopediaRepository;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.elasticsearch.common.unit.Fuzziness;
import org.springframework.stereotype.Service;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortOrder;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EncyclopediaService {

    private final RestHighLevelClient client;
    private final EncyclopediaRepository encyclopediaRepository;
    private final PopularIngredientService popularIngredientService;

    private static final Set<String> VALID_TYPES = Set.of("감미료", "보존제", "산화방지제", "착향료", "탄수화물");

    public Map<String, Object> searchWithSuggestion(String query, boolean suggested) {
        log.info("🩵 Elasticsearch 검색 실행: query={}, suggested={}", query, suggested);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("originalQuery", query);  // 항상 포함

        if (!suggested) {
            List<EncyclopediaSearchResponse> exactResults = encyclopediaRepository.findByNameContaining(query)
                .stream()
                .map(EncyclopediaSearchResponse::from)
                .toList();

            result.put("suggestedName", null);
            result.put("results", exactResults);
            return result;
        }

        SearchSourceBuilder builder = new SearchSourceBuilder()
            .query(QueryBuilders.matchQuery("name", query).fuzziness(Fuzziness.AUTO))
            .size(20);

        SearchRequest request = new SearchRequest("ingredients").source(builder);

        try {
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            List<EncyclopediaSearchResponse> results = Arrays.stream(response.getHits().getHits())
                .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                .collect(Collectors.toList());

            if (!results.isEmpty()) {
                String accurateName = results.get(0).getName();
                result.put("suggestedName", !accurateName.equalsIgnoreCase(query) ? accurateName : null);
                result.put("results", results);

                // ✅ 무조건 추천 결과 기준으로 카운트 반영
                popularIngredientService.incrementSearchCount(accurateName);

                return result;
            }

            // fallback 처리
            SearchSourceBuilder fallbackBuilder = new SearchSourceBuilder()
                .query(QueryBuilders.prefixQuery("name.keyword", query))
                .size(20);

            SearchRequest fallbackRequest = new SearchRequest("ingredients").source(fallbackBuilder);
            SearchResponse fallbackResponse = client.search(fallbackRequest, RequestOptions.DEFAULT);

            List<EncyclopediaSearchResponse> fallbackResults = Arrays.stream(fallbackResponse.getHits().getHits())
                .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                .collect(Collectors.toList());

            result.put("suggestedName", null);
            result.put("results", fallbackResults);
            return result;

        } catch (Exception e) {
            log.error("🩷 Elasticsearch 검색 중 오류 발생", e);
            throw new IngredientException(ErrorCode.INGREDIENT_NOT_FOUND);
        }
    }

    public EncyclopediaDetailResponse getIngredientDetail(String id) {
        IngredientDictionary ingredient = encyclopediaRepository.findById(id)
                .orElseThrow(() -> new IngredientException(ErrorCode.INGREDIENT_NOT_FOUND));
        return EncyclopediaMapper.toDetailResponse(ingredient);
    }

    public List<EncyclopediaSearchResponse> getIngredientsByType(String category, String sort, String order, int size) {
        if (!VALID_TYPES.contains(category)) {
            throw new IngredientException(ErrorCode.INGREDIENT_NOT_FOUND);
        }

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .filter(QueryBuilders.termQuery("category", category));

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder()
                .query(boolQuery)
                .size(size);

        if (sort != null && (sort.equals("gi") || sort.equals("sweetness"))) {
            SortOrder sortOrder = "asc".equalsIgnoreCase(order) ? SortOrder.ASC : SortOrder.DESC;
            sourceBuilder.sort(new FieldSortBuilder(sort).order(sortOrder));
        }

        SearchRequest request = new SearchRequest("ingredients").source(sourceBuilder);

        try {
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            return Arrays.stream(response.getHits().getHits())
                    .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new IngredientException(ErrorCode.INGREDIENT_NOT_FOUND);
        }
    }

}
