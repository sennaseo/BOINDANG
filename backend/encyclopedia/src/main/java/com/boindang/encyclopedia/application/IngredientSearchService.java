package com.boindang.encyclopedia.application;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.boindang.encyclopedia.common.exception.ElasticSearchException;
import com.boindang.encyclopedia.infrastructure.EncyclopediaRepository;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaSearchResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngredientSearchService {

	private final EncyclopediaRepository encyclopediaRepository;
	private final AutocompleteCacheService cacheService;
	private final AutocompleteSearchService autocompleteSearchService;
	private final FuzzySearchService fuzzySearchService;

	public Map<String, Object> search(String query, boolean flag) {
		Map<String, Object> result = new LinkedHashMap<>();
		result.put("originalQuery", query); // 사용자가 입력한 검색어 저장

		// 0️⃣ flag=false: 정확한 검색만 수행 (자동완성, 오타 대응 X)
		if (!flag) {
			// DB에서 name 필드에 query가 포함된 항목들 조회
			List<EncyclopediaSearchResponse> exact = encyclopediaRepository.findByNameContaining(query)
				.stream()
				.map(EncyclopediaSearchResponse::from)
				.toList();

			// 응답 구성
			result.put("suggestedName", null);
			result.put("results", exact);
			return result;
		}

		try {
			// 1️⃣ 'ㅁ'과 같이 초성까지만 입력: Redis 캐싱을 통한 자동완성 조회
			if (query.length() == 1 && query.matches("^[ㄱ-ㅎ]$")) {
				List<EncyclopediaSearchResponse> cached = cacheService.getCachedAutocomplete(query);
				result.put("suggestedName", null);
				if (!cached.isEmpty()) {
					result.put("results", cached);
					return result;
				}

				result.put("results", List.of());
				return result;
			}

			// 2️⃣ Elasticsearch 자동완성 fallback (edge_ngram 기반 prefix 검색)
			List<EncyclopediaSearchResponse> autoResults = autocompleteSearchService.searchAutocomplete(query);
			if (!autoResults.isEmpty()) {
				result.put("suggestedName", null);
				result.put("results", autoResults);
				return result;
			}

			// 3️⃣ Fuzzy 검색 (오타 대응)
			EncyclopediaSearchResponse fuzzy = fuzzySearchService.searchFuzzy(query);
			if (fuzzy != null) {
				result.put("suggestedName", !fuzzy.getName().equalsIgnoreCase(query) ? fuzzy.getName() : null);
				result.put("results", List.of(fuzzy));
				return result;
			}

			result.put("suggestedName", null);
			result.put("results", List.of());
			return result;
		} catch (Exception e) {
			log.error("❌ Elasticsearch 검색 중 오류 - query={}, message={}", query, e.getMessage(), e);
			throw new ElasticSearchException("성분 검색 중 오류가 발생했습니다.");
		}
	}
}
