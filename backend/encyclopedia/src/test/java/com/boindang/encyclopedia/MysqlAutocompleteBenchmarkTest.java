package com.boindang.encyclopedia;

import static org.springframework.test.util.AssertionErrors.*;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.boindang.encyclopedia.domain.Ingredient;
import com.boindang.encyclopedia.infrastructure.IngredientRepository;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
@DisplayName("⏱️ MySQL 자동완성 검색 속도 측정 테스트")
class MysqlAutocompleteBenchmarkTest {

	@Autowired
	private IngredientRepository repository;

	@Test
	void autocomplete_likePrefix_benchmark() {
		String prefix = "말티";
		long totalTime = 0;

		for (int i = 0; i < 100; i++) {
			long start = System.nanoTime();
			List<Ingredient> results = repository.findByNameStartingWith(prefix);
			long end = System.nanoTime();

			totalTime += (end - start);

			// 정확도 체크
			assertFalse(results.isEmpty(), "자동완성 결과 없음");
		}

		System.out.println("⏱️ MySQL 자동완성 평균 검색시간: " + (totalTime / 100_0000.0) + "ms");
	}
}

