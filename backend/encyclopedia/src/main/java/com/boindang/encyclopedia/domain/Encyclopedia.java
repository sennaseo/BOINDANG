package com.boindang.encyclopedia.domain;

import com.boindang.encyclopedia.infrastructure.JsonStringConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "encyclopedia_json")
public class Encyclopedia {
	@Id
	private String id;

	private String name;

	@Column(columnDefinition = "json")
	@Convert(converter = JsonStringConverter.class)
	private String data; // 또는 Map<String, Object>

}
