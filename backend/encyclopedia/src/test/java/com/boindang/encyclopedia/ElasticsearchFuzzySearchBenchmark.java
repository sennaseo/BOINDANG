package com.boindang.encyclopedia;

import static org.junit.jupiter.api.Assertions.*;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@DisplayName("⏱️ ES 오타 검색 속도 측정 테스트")
class ElasticsearchFuzzySearchBenchmark {

	@Autowired
	private RestHighLevelClient client;

	@Test
	void fuzzySearch_benchmark() throws Exception {
		String typo = "말티똘";
		long totalTime = 0;

		for (int i = 0; i < 100; i++) {
			SearchSourceBuilder builder = new SearchSourceBuilder()
				.query(QueryBuilders.matchQuery("name", typo)
					.fuzziness(Fuzziness.AUTO));

			SearchRequest request = new SearchRequest("ingredients_test").source(builder);

			long start = System.nanoTime();
			SearchResponse response = client.search(request, RequestOptions.DEFAULT);
			long end = System.nanoTime();

			totalTime += (end - start);

			assertTrue(response.getHits().getTotalHits().value > 0);
		}

		System.out.println("⏱️ Elasticsearch 오타 검색 평균 시간: " + (totalTime / 100_0000.0) + "ms");
	}
}

