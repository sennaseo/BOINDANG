package com.boindang.encyclopedia.infrastructure;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class JsonStringConverter implements AttributeConverter<String, String> {

	@Override
	public String convertToDatabaseColumn(String attribute) {
		return attribute; // DB에 저장할 때 그대로 저장
	}

	@Override
	public String convertToEntityAttribute(String dbData) {
		return dbData; // DB에서 읽을 때 그대로 반환 (파싱 X)
	}
}
