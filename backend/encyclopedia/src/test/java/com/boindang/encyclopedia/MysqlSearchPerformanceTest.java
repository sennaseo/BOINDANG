package com.boindang.encyclopedia;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.boindang.encyclopedia.domain.Ingredient;
import com.boindang.encyclopedia.infrastructure.IngredientRepository;

@SpringBootTest
@DisplayName("MySQL 성분 검색 성능 테스트")
class MysqlSearchPerformanceTest {

	@Autowired
	private IngredientRepository ingredientRepository;

	@Test
	void searchByName_exactMatch_mysql() {
		String keyword = "말티톨";
		long totalTime = 0;

		for (int i = 0; i < 100; i++) {
			long start = System.nanoTime();
			Optional<Ingredient> result = ingredientRepository.findByName(keyword);
			long end = System.nanoTime();

			totalTime += (end - start);

			// 정확도 테스트
			assertTrue(result.isPresent());
		}

		System.out.println("MySQL 평균 검색시간: " + (totalTime / 100_0000.0) + "ms");
	}
}
