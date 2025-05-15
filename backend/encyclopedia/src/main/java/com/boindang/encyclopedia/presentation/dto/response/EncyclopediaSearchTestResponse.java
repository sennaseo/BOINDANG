package com.boindang.encyclopedia.presentation.dto.response;

import com.boindang.encyclopedia.domain.Encyclopedia;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
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
			ObjectMapper mapper = new ObjectMapper();
			// 💡 문자열 내부의 쌍따옴표를 자동 처리하도록 옵션 설정 (권장)
			mapper.configure(DeserializationFeature.FAIL_ON_TRAILING_TOKENS, false);
			parsedData = mapper.readValue(entity.getData(), new TypeReference<>() {});
		} catch (Exception e) {
			System.err.println("❗ JSON 파싱 오류: " + e.getMessage());
		}

		return EncyclopediaSearchTestResponse.builder()
			.id(String.valueOf(entity.getId()))
			.name(entity.getName())
			.data(parsedData)
			.build();
	}


}
