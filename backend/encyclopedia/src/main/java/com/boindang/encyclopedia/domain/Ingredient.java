package com.boindang.encyclopedia.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredient")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredient {

	@Id
	private String id;

	private String name; // 검색용 키워드

	private String category;

	private int gi;

	private float calories;
}

