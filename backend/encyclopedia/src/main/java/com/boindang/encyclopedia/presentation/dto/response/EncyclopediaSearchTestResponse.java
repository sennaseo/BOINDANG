package com.boindang.encyclopedia.presentation.dto.response;

import java.util.Map;

import com.boindang.encyclopedia.domain.Encyclopedia;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EncyclopediaSearchTestResponse {

	private String id;
	private String name;
	private Map<String, Object> data;

	public static EncyclopediaSearchTestResponse from(Encyclopedia entity) {
		Map<String, Object> parsedData = null;
		try {
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL, true); // 에러 방어
			parsedData = mapper.readValue(entity.getData(), new TypeReference<>() {});
		} catch (Exception e) {
			System.err.println("❗ JSON 파싱 오류: " + e.getMessage());
		}

		return EncyclopediaSearchTestResponse.builder()
			.id(entity.getId())
			.name(entity.getName())
			.data(parsedData)
			.build();
	}
}
