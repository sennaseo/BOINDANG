package com.boindang.encyclopedia.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.boindang.encyclopedia.domain.Ingredient;
import com.boindang.encyclopedia.infrastructure.IngredientRepository;

import lombok.RequiredArgsConstructor;

@Component
@Profile("test")
@RequiredArgsConstructor
public class IngredientTestDataLoader implements CommandLineRunner {

	private final IngredientRepository ingredientRepository;

	@Override
	public void run(String... args) {
		if (ingredientRepository.count() == 0) {
			List<Ingredient> dummyData = new ArrayList<>();
			for (int i = 1; i <= 1000; i++) {
				dummyData.add(Ingredient.builder()
					.id("dummy_" + i)
					.name("더미성분" + i)
					.category("더미카테고리")
					.gi(10 + i % 50)
					.calories(5.0f + i % 10)
					.build());
			}
			ingredientRepository.saveAll(dummyData);
			System.out.println("✅ 테스트용 더미 성분 1000개 삽입 완료");
		}
	}
}

