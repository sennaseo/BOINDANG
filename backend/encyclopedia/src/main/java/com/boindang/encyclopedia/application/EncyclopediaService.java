package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.application.mapper.EncyclopediaMapper;
import com.boindang.encyclopedia.common.exception.ErrorCode;
import com.boindang.encyclopedia.common.exception.IngredientException;
import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.infrastructure.EncyclopediaRepository;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaSearchResponse;
import com.boindang.encyclopedia.presentation.dto.response.IngredientListResponse;

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

    private static final Set<String> VALID_TYPES = Set.of("감미료", "식품첨가물", "단백질", "당류", "탄수화물", "식이섬유", "지방", "비타민", "미네랄");

    public Map<String, Object> searchWithSuggestion(String query, boolean flag) {
        log.info("🩵 Elasticsearch 검색 실행: query={}, suggested={}", query, flag);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("originalQuery", query);

        if (!flag) {
            List<EncyclopediaSearchResponse> exactResults = encyclopediaRepository.findByNameContaining(query)
                .stream()
                .map(EncyclopediaSearchResponse::from)
                .toList();

            // ✅ 정확 검색도 카운트 집계
            popularIngredientService.incrementSearchCount(query);

            result.put("suggestedName", null);
            result.put("results", exactResults);
            return result;
        }

        try {
            // ✅ 1단계: prefixQuery (자동완성)
            SearchSourceBuilder prefixBuilder = new SearchSourceBuilder()
                .query(QueryBuilders.prefixQuery("name.keyword", query))
                .size(20);

            SearchResponse prefixResponse = client.search(
                new SearchRequest("ingredients").source(prefixBuilder),
                RequestOptions.DEFAULT
            );

            List<EncyclopediaSearchResponse> prefixResults = Arrays.stream(prefixResponse.getHits().getHits())
                .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                .collect(Collectors.toList());

            if (!prefixResults.isEmpty()) {
                // ✅ prefix 검색어도 그대로 카운트
                popularIngredientService.incrementSearchCount(query);

                result.put("suggestedName", null);
                result.put("results", prefixResults);
                return result;
            }

            // ✅ 2단계: 오타 대응 fuzzy match
            SearchSourceBuilder fuzzyBuilder = new SearchSourceBuilder()
                .query(QueryBuilders.matchQuery("name", query)
                    .fuzziness(Fuzziness.TWO)
                    .prefixLength(0)
                    .maxExpansions(50)
                    .fuzzyTranspositions(true))
                .size(1);

            SearchResponse fuzzyResponse = client.search(
                new SearchRequest("ingredients").source(fuzzyBuilder),
                RequestOptions.DEFAULT
            );

            List<EncyclopediaSearchResponse> fuzzyResults = Arrays.stream(fuzzyResponse.getHits().getHits())
                .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                .collect(Collectors.toList());

            if (!fuzzyResults.isEmpty()) {
                String accurateName = fuzzyResults.get(0).getName();

                // ✅ 추천어로 카운트
                popularIngredientService.incrementSearchCount(accurateName);

                result.put("suggestedName", !accurateName.equalsIgnoreCase(query) ? accurateName : null);
                result.put("results", fuzzyResults);
                return result;
            }

            // ✅ fallback도 검색어 그대로 카운트
            popularIngredientService.incrementSearchCount(query);

            List<EncyclopediaSearchResponse> fallbackResults = encyclopediaRepository.findByNameContaining(query)
                .stream()
                .map(EncyclopediaSearchResponse::from)
                .toList();

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

    public IngredientListResponse getIngredientsByType(String category, String sort, String order, int size, int page) {
        if (!VALID_TYPES.contains(category)) {
            throw new IngredientException(ErrorCode.INGREDIENT_NOT_FOUND);
        }

        // 1. 필터 조건
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
            .filter(QueryBuilders.termQuery("category", category));

        // 2. 정렬 조건
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder()
            .query(boolQuery)
            .from(page * size)  // ✅ 페이징 처리 시작 인덱스
            .size(size);        // ✅ 한 페이지 크기

        if (sort != null && (sort.equals("gi") || sort.equals("sweetness"))) {
            SortOrder sortOrder = "asc".equalsIgnoreCase(order) ? SortOrder.ASC : SortOrder.DESC;
            sourceBuilder.sort(new FieldSortBuilder(sort).order(sortOrder));
        }

        // 3. Elasticsearch 요청 생성
        SearchRequest request = new SearchRequest("ingredients").source(sourceBuilder);

        try {
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);

            long totalHits = response.getHits().getTotalHits().value;
            int totalPages = (int) Math.ceil((double) totalHits / size);

            List<EncyclopediaSearchResponse> ingredients = Arrays.stream(response.getHits().getHits())
                .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                .collect(Collectors.toList());

            return new IngredientListResponse(totalPages, ingredients);

        } catch (IOException e) {
            throw new IngredientException(ErrorCode.INGREDIENT_NOT_FOUND);
        }
    }

}
