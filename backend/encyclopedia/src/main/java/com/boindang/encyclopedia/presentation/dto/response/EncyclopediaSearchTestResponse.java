package com.boindang.encyclopedia.presentation.dto.response;

import com.boindang.encyclopedia.domain.Encyclopedia;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EncyclopediaSearchTestResponse {

	private String id;
	private String name;
	private String data;

	public static EncyclopediaSearchTestResponse from(Encyclopedia entity) {
		return EncyclopediaSearchTestResponse.builder()
			.id(String.valueOf(entity.getId()))
			.name(entity.getName())
			.data(entity.getData())
			.build();
	}


}
