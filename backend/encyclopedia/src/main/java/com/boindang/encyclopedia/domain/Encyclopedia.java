package com.boindang.encyclopedia.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "encyclopedia_json")
public class Encyclopedia {
	@Id
	@GeneratedValue
	private Long id;

	private String name;

	@Column(columnDefinition = "json")
	private String data; // 또는 Map<String, Object>


	@Enumerated(EnumType.STRING)
	private IngredientDictionary.RiskLevel riskLevel;
}
