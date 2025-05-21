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
@DisplayName("MySQL 자동완성 테스트: LIKE '말티%'")
class MysqlAutocompleteTest {

	@Autowired
	private IngredientRepository repository;

	@Test
	void autocomplete_likePrefix() {
		String prefix = "말티";

		List<Ingredient> results = repository.findByNameStartingWith(prefix);
		assertFalse(results.isEmpty());

		results.forEach(ingredient ->
			System.out.println("자동완성 결과: " + ingredient.getName()));
	}
}

