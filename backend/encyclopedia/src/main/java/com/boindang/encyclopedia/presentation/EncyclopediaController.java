package com.boindang.encyclopedia.presentation;

import com.boindang.encyclopedia.application.EncyclopediaService;
import com.boindang.encyclopedia.common.response.ApiResponses;
import com.boindang.encyclopedia.common.response.ErrorResponse;
import com.boindang.encyclopedia.presentation.api.EncyclopediaApi;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.response.IngredientListResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class EncyclopediaController implements EncyclopediaApi {

    private final EncyclopediaService encyclopediaService;

    @Override
    @GetMapping("/search")
    public ApiResponses<Map<String, Object>> searchIngredients(
            @RequestParam String query,
            @RequestParam(required = false, defaultValue = "true") Boolean suggested
    ) {
        log.info("🩵 성분 검색 with query={}, suggested={}", query, suggested);
        if (query == null || query.trim().isEmpty()) {
            return ApiResponses.error(new ErrorResponse(HttpStatus.BAD_REQUEST, "검색어를 입력해주세요."));
        }

        return ApiResponses.success(encyclopediaService.searchWithSuggestion(query, suggested));
    }

    @Override
    @GetMapping("/ingredient/{id}")
    public ApiResponses<EncyclopediaDetailResponse> getDetail(@PathVariable String id) {
        return ApiResponses.success(encyclopediaService.getIngredientDetail(id));
    }

    @Override
    @GetMapping("/category")
    public ApiResponses<IngredientListResponse> getIngredientsByCategory(
        @RequestParam String category,
        @RequestParam(required = false) String sort,
        @RequestParam(defaultValue = "desc") String order,
        @RequestParam(defaultValue = "15") int size,
        @RequestParam(defaultValue = "0") int page
    ) {
        return ApiResponses.success(encyclopediaService.getIngredientsByType(category, sort, order, size, page));
    }

}
