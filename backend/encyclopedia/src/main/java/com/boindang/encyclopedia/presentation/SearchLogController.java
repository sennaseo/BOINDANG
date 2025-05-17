package com.boindang.encyclopedia.presentation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.encyclopedia.application.PopularIngredientService;
import com.boindang.encyclopedia.common.response.ApiResponses;
import com.boindang.encyclopedia.common.response.ErrorResponse;
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
	public ApiResponses<String> countSearch(@RequestParam String request) {
		if (request == null || request.trim().isEmpty()) {
			return ApiResponses.error(new ErrorResponse(HttpStatus.BAD_REQUEST, "검색어를 입력해주세요."));
		}

		return ApiResponses.success(popularIngredientService.incrementSearchCount(request));
	}
}

