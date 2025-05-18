package com.boindang.encyclopedia.application;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

import com.boindang.encyclopedia.common.exception.ElasticSearchException;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaSearchResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutocompleteSearchService {

	private final RestHighLevelClient client;

	/**
	 * Elasticsearch에서 edge_ngram 기반의 prefix 자동완성 검색을 수행
	 *
	 * - name 필드에 설정된 autocomplete analyzer를 기반으로 사용자가 입력한 query로 시작하는 성분명을 검색
	 * - match_phrase_prefix 쿼리를 사용하여 접두어 일치 검색을 수행
	 * - 최대 10개의 결과를 반환하며, 결과는 성분 이름 기준 정렬되지 않음
	 *
	 * @param query 사용자가 입력한 검색어
	 * @return 검색어로 시작하는 성분들의 응답 리스트
	 */
	public List<EncyclopediaSearchResponse> searchAutocomplete(String query) {
		try {
			// 1. Elasticsearch 쿼리 구성 객체 생성
			SearchSourceBuilder builder = new SearchSourceBuilder()
				.query(QueryBuilders.matchPhrasePrefixQuery("name", query)) // match_phrase_prefix 쿼리로 자동완성 prefix 검색 설정 -> name 필드에서 query로 시작하는 단어를 찾음 (edge_ngram 기반)
				.size(10); // 최대 10개까지

			// 2. Elasticsearch에 검색 요청
			SearchResponse response = client.search(
				new SearchRequest("ingredients").source(builder),// 검색 요청 객체 생성 (index: "ingredients")
				RequestOptions.DEFAULT
			);

			// 3. 검색 결과(hit들)를 리스트로 반환
			return Arrays.stream(response.getHits().getHits())
				.map(hit -> EncyclopediaSearchResponse.from2(hit.getSourceAsMap()))
				.toList();
		} catch (Exception e) {
			log.error("❌ Elasticsearch 자동완성 검색 실패 - query={}, message={}", query, e.getMessage(), e);
			throw new ElasticSearchException("자동완성 검색 중 오류가 발생했습니다.");
		}
	}
}

