package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.application.mapper.EncyclopediaMapper;
import com.boindang.encyclopedia.common.exception.ErrorCode;
import com.boindang.encyclopedia.common.exception.IngredientException;
import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.infrastructure.EncyclopediaRepository;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.search.suggest.Suggest;
import org.elasticsearch.search.suggest.SuggestBuilder;
import org.elasticsearch.search.suggest.SuggestBuilders;
import org.elasticsearch.search.suggest.completion.CompletionSuggestion;
import org.elasticsearch.search.suggest.term.TermSuggestionBuilder;
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

            result.put("suggestedName", null);
            result.put("results", exactResults);
            return result;
        }

        try {
            // ✅ 1단계: prefixQuery (정확한 접두어 자동완성)
            SearchSourceBuilder prefixBuilder = new SearchSourceBuilder()
                .query(QueryBuilders.prefixQuery("name.keyword", query))  // keyword 필드 기준
                .size(20);

            SearchResponse prefixResponse = client.search(
                new SearchRequest("ingredients").source(prefixBuilder),
                RequestOptions.DEFAULT
            );

            List<EncyclopediaSearchResponse> prefixResults = Arrays.stream(prefixResponse.getHits().getHits())
                .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                .collect(Collectors.toList());

            if (!prefixResults.isEmpty()) {
                result.put("suggestedName", null);
                result.put("results", prefixResults);
                return result;
            }

            // ✅ 2단계: matchQuery + fuzziness (오타 대응)
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
                result.put("suggestedName", !accurateName.equalsIgnoreCase(query) ? accurateName : null);
                result.put("results", fuzzyResults);
                return result;
            }

            // ✅ 3단계: DB fallback
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
