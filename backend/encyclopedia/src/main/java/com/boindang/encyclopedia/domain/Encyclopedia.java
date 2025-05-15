package com.boindang.encyclopedia.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;

@Getter
@Entity
public class Encyclopedia {
	@Id
	@GeneratedValue
	private Long id;

	private String name;
	private String engName;
	private String type;

	@Enumerated(EnumType.STRING)
	private IngredientDictionary.RiskLevel riskLevel;
}
