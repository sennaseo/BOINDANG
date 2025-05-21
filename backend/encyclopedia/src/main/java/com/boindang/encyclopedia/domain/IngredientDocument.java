package com.boindang.encyclopedia.domain;

import org.springframework.data.elasticsearch.annotations.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Document(indexName = "ingredients_test")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientDocument {

	@Id
	private String id;

	private String name;
	private String category;
	private int gi;
	private float calories;
}

