package com.boindang.encyclopedia.infrastructure;

import com.boindang.encyclopedia.domain.IngredientDictionary;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EncyclopediaRepository extends ElasticsearchRepository<IngredientDictionary, String> {
    List<IngredientDictionary> findByNameContaining(String query);
    List<IngredientDictionary> findByNameIn(List<String> names);

}
