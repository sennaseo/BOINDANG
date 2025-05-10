package com.boindang.encyclopedia.presentation;

import com.boindang.encyclopedia.common.response.BaseResponse;
import com.boindang.encyclopedia.presentation.dto.PopularIngredientResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Tag(name = "백과사전_인기검색어", description = "실시간 인기 검색어 관련 API입니다.")
public interface PopularIngredientApi {

    @Operation(
            summary = "실시간 인기 성분 조회",
            description = "Redis에 저장된 인기 성분을 검색 수 순으로 조회합니다."
    )
    @GetMapping("/popular")
    BaseResponse<List<PopularIngredientResponse>> getPopularIngredients(
            @Parameter(description = "조회할 인기 성분 개수", example = "3")
            @RequestParam(defaultValue = "3") int limit
    );
}
