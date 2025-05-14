package com.boindang.encyclopedia.presentation;

import com.boindang.encyclopedia.application.EncyclopediaService;
import com.boindang.encyclopedia.common.response.BaseResponse;
import com.boindang.encyclopedia.presentation.api.EncyclopediaApi;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class EncyclopediaController implements EncyclopediaApi {

    private final EncyclopediaService encyclopediaService;

    @Override
    @GetMapping("/search")
    public BaseResponse<Map<String, Object>> searchIngredients(
            @RequestParam String query,
            @RequestParam(required = false) Boolean suggested
    ) {
        log.info("🩵 성분 검색 with query={}, suggested={}", query, suggested);
        if (query == null || query.trim().isEmpty()) {
            return BaseResponse.fail(400, "검색어를 입력하세요.");
        }

        return BaseResponse.success(encyclopediaService.searchWithSuggestion(query, suggested));
    }

    @Override
    @GetMapping("/ingredient/{id}")
    public BaseResponse<EncyclopediaDetailResponse> getDetail(@PathVariable String id) {
        return BaseResponse.success(encyclopediaService.getIngredientDetail(id));
    }

    @Override
    @GetMapping("/category")
    public BaseResponse<List<EncyclopediaSearchResponse>> getIngredientsByCategory(
        @RequestParam String category,
        @RequestParam(required = false) String sort,
        @RequestParam(defaultValue = "desc") String order,
        @RequestParam(defaultValue = "20") int size
    ) {
        List<EncyclopediaSearchResponse> result = encyclopediaService.getIngredientsByType(category, sort, order, size);
        return BaseResponse.success(result);
    }

}
