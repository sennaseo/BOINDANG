package com.boindang.encyclopedia;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.boindang.encyclopedia.domain.IngredientDocument;
import com.boindang.encyclopedia.infrastructure.IngredientElasticRepository;

@SpringBootTest
@DisplayName("Elasticsearch 성분 검색 성능 테스트")
class ElasticSearchPerformanceTest {

	@Autowired
	private IngredientElasticRepository repository;

	@Test
	void searchByName_exactMatch_es() {
		String keyword = "말티톨";
		long totalTime = 0;

		for (int i = 0; i < 100; i++) {
			long start = System.nanoTime();
			Optional<IngredientDocument> result = repository.findByName(keyword);
			long end = System.nanoTime();

			totalTime += (end - start);
			assertTrue(result.isPresent());
		}

		System.out.println("Elasticsearch 평균 검색시간: " + (totalTime / 100_0000.0) + "ms");
	}
}


