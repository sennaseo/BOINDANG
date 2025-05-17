package com.boindang.encyclopedia.presentation.api;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import com.boindang.encyclopedia.common.response.ApiResponses;
import com.boindang.encyclopedia.presentation.dto.request.SearchCountRequest;
import org.springframework.web.bind.annotation.*;

@Tag(name = "백과사전_검색카운트", description = "사용자 검색 확정 시 인기 검색어 통계를 기록하는 API입니다.")
public interface SearchLogApi {

	@Operation(
		summary = "검색어 카운트 증가",
		description = "사용자가 검색 버튼 클릭 또는 엔터 입력을 통해 검색을 확정했을 때, 해당 키워드를 Redis에 기록하여 실시간 인기 검색어 통계를 누적합니다."
	)
	@PostMapping("/count")
	ApiResponses<String> countSearch(
		@Parameter(description = "사용자가 확정 검색한 키워드", example = "말티톨")
		@RequestBody SearchCountRequest request
	);
}

