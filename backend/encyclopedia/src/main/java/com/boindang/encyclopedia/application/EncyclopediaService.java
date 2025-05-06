package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.application.mapper.EncyclopediaMapper;
import com.boindang.encyclopedia.common.exception.ErrorCode;
import com.boindang.encyclopedia.common.exception.IngredientException;
import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.infrastructure.EncyclopediaRepository;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaSearchResponse;
import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class EncyclopediaService {

    private final RestHighLevelClient client;
    private final EncyclopediaRepository encyclopediaRepository;
    private final PopularIngredientService popularIngredientService;

    private static final Set<String> VALID_TYPES = Set.of("감미료", "보존제", "산화방지제", "착향료");

    public void saveIngredientData() {
        IngredientDictionary ingredient = IngredientDictionary.builder()
                .id("stevia")
                .name("스테비아")
                .engName("Stevia")
                .category("감미료")
                .type("천연 감미료")
                .riskLevel(IngredientDictionary.RiskLevel.SAFE)
                .gi(0)
                .calories(0)
                .sweetness(250)
                .description("스테비아는 남아메리카 원산의 식물 '스테비아 레바우디아나(Stevia rebaudiana)'의 잎에서 추출한 천연 감미료입니다. 설탕보다 최대 250배까지 달지만 칼로리는 거의 없으며, 혈당 지수도 0에 가까워 당뇨병 환자나 체중 관리가 필요한 사람들에게 매우 적합한 감미료로 널리 사용됩니다.")
                .examples(List.of("무설탕 탄산음료", "다이어트용 음료 및 간식", "설탕 대체 건강식품", "저탄고지 및 키토 제품", "천연 유래 영양제"))
                .references(List.of(
                        "Anton SD et al. “Stevia: A review of safety and efficacy for human consumption.” Journal of Nutrition, 2010.",
                        "EFSA Panel. “Scientific opinion on steviol glycosides.” EFSA Journal, 2010.",
                        "Chatsudthipong V & Muanprasat C. “Stevioside and related compounds: therapeutic benefits beyond sweetness.” Pharmacology & Therapeutics, 2009."
                ))
                .bloodResponse("GI가 0으로, 혈당을 전혀 상승시키지 않으며 인슐린 분비에도 영향을 주지 않습니다. 당뇨병 환자에게 안전하게 권장됩니다.")
                .digestEffect("일반적인 섭취량에서는 위장에 큰 문제를 일으키지 않으며, 대부분 장에서 흡수되지 않고 배출됩니다.")
                .toothEffect("구강 내 박테리아에 의해 발효되지 않기 때문에 충치 예방에 효과적입니다.")
                .pros(List.of("혈당 상승 없음 (GI = 0)", "칼로리 없음", "강력한 감미도 (설탕 대비 250배)", "천연 유래로 소비자 선호도 높음"))
                .cons(List.of("강한 단맛이 취향에 따라 거부감 유발", "일부 제품에서 쓴맛 또는 금속성 잔미 발생", "고온 조리 시 단맛이 약해질 수 있음"))
                .diabetic(List.of(
                        "혈당에 영향을 주지 않아 매우 적합",
                        "장기 복용 시에도 안정성 입증",
                        "인슐린 저항성과 관련된 부작용 없음"
                ))
                .kidneyPatient(List.of(
                        "신장에서 대사되지 않기 때문에 비교적 안전",
                        "다만 스테비아 보조성분과의 상호작용 주의 필요"
                ))
                .Dieter(List.of(
                        "완전 무칼로리 대체 감미료로 적극 추천",
                        "다이어트 음료, 디저트에 널리 활용 가능"
                ))
                .muscleBuilder(List.of(
                        "혈당 변동 없이 단맛 제공 가능",
                        "단백질 보충제나 스포츠 음료에 널리 사용"
                ))
                .recommendedDailyIntake(4) // steviol equivalent 기준: 4mg/kg
                .regulatory("FDA, EFSA, WHO 모두 안전성을 인정하여 식품 첨가물로 승인. 국내 식약처도 천연 감미료로 허용 중.")
                .issue("고용량 섭취 시 임산부나 특정 약물 복용자에게 호르몬 작용에 영향을 미칠 가능성이 제기되었으나, 일반적인 섭취 수준에서는 문제 없음.")
                .compareTable(List.of(
                        new IngredientDictionary.CompareItem("수크랄로스", 0, 0f, 600f, "주의"),
                        new IngredientDictionary.CompareItem("아스파탐", 0, 0f, 200f, "주의"),
                        new IngredientDictionary.CompareItem("설탕", 65, 4f, 1f, "위험")
                ))
                .build();

        encyclopediaRepository.save(ingredient);
    }

    public List<EncyclopediaSearchResponse> searchIngredients(String query) {
        SearchSourceBuilder builder = new SearchSourceBuilder()
                .query(QueryBuilders.matchQuery("name", query)
                        .fuzziness(Fuzziness.AUTO))
                .size(20);

        SearchRequest request = new SearchRequest("ingredients").source(builder);

        try {
            SearchResponse response = client.search(request, RequestOptions.DEFAULT);
            List<EncyclopediaSearchResponse> results = Arrays.stream(response.getHits().getHits())
                    .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                    .collect(Collectors.toList());

            // Fuzzy 결과가 없으면 Prefix 기반으로 fallback
            if (results.isEmpty()) {
                SearchSourceBuilder fallbackBuilder = new SearchSourceBuilder()
                        .query(QueryBuilders.prefixQuery("name.keyword", query)) // keyword or edge_ngram 가능
                        .size(20);

                SearchRequest fallbackRequest = new SearchRequest("ingredients").source(fallbackBuilder);
                SearchResponse fallbackResponse = client.search(fallbackRequest, RequestOptions.DEFAULT);

                results = Arrays.stream(fallbackResponse.getHits().getHits())
                        .map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
                        .collect(Collectors.toList());
            }

            if (!results.isEmpty()) {
                popularIngredientService.incrementSearchCount(results.get(0).getName());
            }

            return results;

        } catch (IOException e) {
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
