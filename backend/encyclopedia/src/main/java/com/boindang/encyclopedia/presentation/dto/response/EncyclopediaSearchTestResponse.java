package com.boindang.encyclopedia.presentation.dto.response;

import com.boindang.encyclopedia.domain.Encyclopedia;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class EncyclopediaSearchTestResponse {

	private String id;
	private String name;
	private Map<String, Object> data;

	public static EncyclopediaSearchTestResponse from(Encyclopedia entity) {
		Map<String, Object> parsedData = null;
		try {
			parsedData = new ObjectMapper().readValue(entity.getData(), new TypeReference<>() {});
		} catch (Exception e) {
			// 로그로만 처리 (실패해도 전체 응답 막진 않게)
			System.err.println("JSON 파싱 오류: " + e.getMessage());
		}

		return EncyclopediaSearchTestResponse.builder()
			.id(String.valueOf(entity.getId()))
			.name(entity.getName())
			.data(parsedData)
			.build();
	}

}
