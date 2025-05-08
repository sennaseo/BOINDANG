package com.boindang.encyclopedia.presentation;

import com.boindang.encyclopedia.application.EncyclopediaService;
import com.boindang.encyclopedia.common.response.BaseResponse;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaSearchResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/encyclopedia/ingredients")
@RequiredArgsConstructor
@Tag(name = "백과사전", description = "영양 성분 백과사전 관련 API입니다.")
public class EncyclopediaController implements EncyclopediaApi {

    private final EncyclopediaService encyclopediaService;

    @Override
    public BaseResponse<Map<String, Object>> searchIngredients(
            @RequestParam String query,
            @RequestParam Boolean suggested
    ) {
        log.info("🩵 성분 검색 with query={}, suggested={}", query, suggested);
        if (query == null || query.trim().isEmpty()) {
            return BaseResponse.fail(400, "검색어를 입력하세요.");
        }

        if (query.trim().length() < 2) {
            return BaseResponse.fail(400, "검색어는 최소 2자 이상 입력해주세요.");
        }

        return BaseResponse.success(encyclopediaService.searchWithSuggestion(query, suggested));
    }

    @Override
    public BaseResponse<EncyclopediaDetailResponse> getDetail(String id) {
        return BaseResponse.success(encyclopediaService.getIngredientDetail(id));
    }

    @Override
    public BaseResponse<List<EncyclopediaSearchResponse>> getIngredientsByCategory(String category, String sort, String order, int size) {
        List<EncyclopediaSearchResponse> result = encyclopediaService.getIngredientsByType(category, sort, order, size);
        return BaseResponse.success(result);
    }

}
