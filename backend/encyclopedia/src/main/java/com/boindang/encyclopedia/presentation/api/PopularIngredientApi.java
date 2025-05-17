package com.boindang.encyclopedia.presentation.api;

import com.boindang.encyclopedia.common.response.ApiResponses;
import com.boindang.encyclopedia.presentation.dto.response.PopularIngredientResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Tag(name = "백과사전_인기검색어", description = "실시간 인기 검색어 조회 API입니다.")
public interface PopularIngredientApi {

    @Operation(summary = "실시간 인기 성분 조회", description = "Redis에 저장된 인기 성분을 검색 수 순으로 조회합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "인기검색어 조회 성공",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(value = """
                                {
                                "data": [
                                  {
                                    "ingredientName": "말티톨",
                                    "count": 30
                                  },
                                  {
                                    "ingredientName": "스테비아",
                                    "count": 16
                                  },
                                  {
                                    "ingredientName": "말토덱스트린",
                                    "count": 5
                                  }
                                ],
                                "error": null,
                                "success": true
                              }
                        """)))
    })
    @GetMapping("/popular")
    ApiResponses<List<PopularIngredientResponse>> getPopularIngredients(
            @Parameter(description = "조회할 인기 성분 개수", example = "3")
            @RequestParam(defaultValue = "3") int limit
    );
}
