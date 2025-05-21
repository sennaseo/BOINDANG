package com.boindang.encyclopedia;

import static org.springframework.test.util.AssertionErrors.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.boindang.encyclopedia.domain.Ingredient;
import com.boindang.encyclopedia.infrastructure.IngredientRepository;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@DisplayName("MySQL 오타 검색 테스트: 실패 예상")
class MysqlFuzzySearchTest {

	@Autowired
	private IngredientRepository repository;

	@Test
	void typoSearch_shouldFail() {
		String typo = "말티똘";

		Optional<Ingredient> result = repository.findByName(typo);
		assertTrue(result.isEmpty()); // ✅ 실패하는 것이 정상
	}
}

