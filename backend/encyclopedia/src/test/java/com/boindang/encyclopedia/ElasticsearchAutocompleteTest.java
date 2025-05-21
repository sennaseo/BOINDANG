package com.boindang.encyclopedia;

import static org.junit.jupiter.api.Assertions.*;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@DisplayName("🔤 ES 자동완성 테스트 (RestHighLevelClient)")
class ElasticsearchAutocompleteRawTest {

	@Autowired
	private RestHighLevelClient client;

	@Test
	void autocomplete_withPrefix() throws Exception {
		String prefix = "말티";

		SearchSourceBuilder builder = new SearchSourceBuilder()
			.query(QueryBuilders.prefixQuery("name", prefix));

		SearchRequest request = new SearchRequest("ingredients_test")
			.source(builder);

		SearchResponse response = client.search(request, RequestOptions.DEFAULT);

		assertTrue(response.getHits().getTotalHits().value > 0);

		for (SearchHit hit : response.getHits()) {
			System.out.println("✅ 자동완성 결과: " + hit.getSourceAsMap().get("name"));
		}
	}
}
