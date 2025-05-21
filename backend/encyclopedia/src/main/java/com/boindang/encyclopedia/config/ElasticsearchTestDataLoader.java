package com.boindang.encyclopedia.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.boindang.encyclopedia.domain.IngredientDocument;
import com.boindang.encyclopedia.infrastructure.IngredientElasticRepository;

import lombok.RequiredArgsConstructor;

@Component
@Profile("test")
@RequiredArgsConstructor
public class ElasticsearchTestDataLoader implements CommandLineRunner {

	private final IngredientElasticRepository repository;

	@Override
	public void run(String... args) {
		if (!repository.existsById("maltitol")) {
			repository.save(IngredientDocument.builder()
				.id("maltitol")
				.name("말티톨")
				.category("감미료")
				.gi(35)
				.calories(2.1f)
				.build());

			System.out.println("✅ ES에 말티톨 insert 완료");
		}
	}
}

