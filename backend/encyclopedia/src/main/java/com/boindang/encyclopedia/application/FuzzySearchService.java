package com.boindang.encyclopedia.application;

import java.util.Arrays;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.boindang.encyclopedia.common.exception.ElasticSearchException;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaSearchResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FuzzySearchService {

	private final RestHighLevelClient client; // Elasticsearch 클라이언트 (Spring에서 주입됨)

	/**
	 * Elasticsearch에서 오타 대응(Fuzzy) 검색을 수행
	 *
	 * - 사용자가 입려한 query가 정확하지 않아도 비슷한 성분 이름을 검색
	 * - matchQuery + fuzziness 옵션을 사용하여 최대 2글자까지 오타 허용
	 * - 가장 유사한 결과 하나만 반환
	 *
	 * @param query 사용자가 입력한 검색어
	 * @return 유사한 성분이 있으면 해당 성분의 응답 객체, 없으면 null
	 */
	public EncyclopediaSearchResponse searchFuzzy(String query) {
		try {
			// 1. 검색 조건 구성 (matchQuery + fuzzy)
			SearchSourceBuilder builder = new SearchSourceBuilder()
				.query(QueryBuilders.matchQuery("name", query)
					.fuzziness(Fuzziness.TWO) // 최대 2글자 오타 허용
					.prefixLength(0) // 처음 글자부터 오타 허용
					.maxExpansions(50) // 최대 후보군 수
					.fuzzyTranspositions(true)) // 철자 전환 허용 (ex. ab -> ba)
				.size(1); // 가장 유사한 결과 1개만

			// 2. Elasticsearch 검색 요청 실행
			SearchResponse response = client.search(
				new SearchRequest("ingredients").source(builder),
				RequestOptions.DEFAULT
			);

			// 3. 검색 결과 중 가장 유사한 결과 1개만 가져옴
			return Arrays.stream(response.getHits().getHits())
				.findFirst() // 결과 1개만
				.map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
				.orElse(null); // 없으면 null 반환

		} catch (Exception e) {
			log.error("❌ Fuzzy 검색 실패: query={}, error={}", query, e.getMessage(), e);
			throw new ElasticSearchException("Fuzzy 검색 중 오류가 발생했습니다.");
		}
	}
}
