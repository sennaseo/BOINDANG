package com.boindang.encyclopedia.infrastructure;

import java.util.Optional;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.boindang.encyclopedia.domain.IngredientDocument;

@Repository
public interface IngredientElasticRepository extends ElasticsearchRepository<IngredientDocument, String> {
	Optional<IngredientDocument> findByName(String name); // 정확 일치 검색
}

