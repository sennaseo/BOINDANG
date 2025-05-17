package com.boindang.encyclopedia.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.encyclopedia.application.PopularIngredientService;
import com.boindang.encyclopedia.common.response.ApiResponses;
import com.boindang.encyclopedia.presentation.api.SearchLogApi;
import com.boindang.encyclopedia.presentation.dto.request.SearchCountRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class SearchLogController implements SearchLogApi {

	private final PopularIngredientService popularIngredientService;

	@Override
	@PostMapping("/count")
	public ApiResponses<String> countSearch(@RequestBody SearchCountRequest request) {
		popularIngredientService.incrementSearchCount(request.keyword());
		return ApiResponses.success(request.keyword() + "이(가) 인기 검색어로 등록되었습니다.");
	}
}

