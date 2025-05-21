package com.boindang.encyclopedia;

import static org.junit.jupiter.api.Assertions.*;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@DisplayName("🧪 ES 오타 검색 테스트 (RestHighLevelClient)")
class ElasticsearchFuzzySearchRawTest {

	@Autowired
	private RestHighLevelClient client;

	@Test
	void fuzzySearch_withTypo() throws Exception {
		String typo = "말티똘";

		SearchSourceBuilder builder = new SearchSourceBuilder()
			.query(QueryBuilders.matchQuery("name", typo)
				.fuzziness(Fuzziness.AUTO));

		SearchRequest request = new SearchRequest("ingredients_test")
			.source(builder);

		SearchResponse response = client.search(request, RequestOptions.DEFAULT);

		assertTrue(response.getHits().getTotalHits().value > 0);

		for (SearchHit hit : response.getHits()) {
			System.out.println("✅ 오타 검색 결과: " + hit.getSourceAsMap().get("name"));
		}
	}
}

