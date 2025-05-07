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
        log.info("Elasticsearch 검색 실행: query={}, suggested={}", query, suggested);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("originalQuery", query);  // 항상 포함

        if (!suggested) {
            // suggestedName 무시하고 원 검색어 그대로 검색 (Fuzzy 없이 정확한 match만 적용 가능)
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

                if (accurateName.equalsIgnoreCase(query)) {
                    popularIngredientService.incrementSearchCount(accurateName);
                }

                return result;
            }

            // Fallback: prefix query
            SearchSourceBuilder fallbackBuilder = new SearchSourceBuilder()
                .query(QueryBuilders.prefixQuery("name.keyword", query))
                .size(20);

            SearchRequest fallbackRequest = new SearchRequest("ingredients").source(fallbackBuilder);
            SearchResponse fallbackResponse = client.search(fallbackRequest, RequestOptions.DEFAULT);

            List<EncyclopediaSearchResponse> fallbackResults = Arrays.stream(fallbackResponse.getHits().getHits())
                .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                .collect(Collectors.toList());

            result.put("suggestedName", null);  // fallback 시에도 명시적으로 null
            result.put("results", fallbackResults);
            return result;

        } catch (Exception e) {
            log.error("Elasticsearch 검색 중 오류 발생", e);  // 전체 스택 찍기
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
                .filter(QueryBuilders.termQuery("category.keyword", category));

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
