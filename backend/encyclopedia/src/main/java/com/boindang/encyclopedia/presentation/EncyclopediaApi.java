package com.boindang.encyclopedia.presentation;

import com.boindang.encyclopedia.common.response.BaseResponse;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaSearchResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RequestMapping("/api/ingredients")
@Tag(name = "백과사전", description = "영양 성분 백과사전 관련 API입니다.")
public interface EncyclopediaApi {

    @Operation(summary = "성분 검색", description = "검색어를 기준으로 성분 검색을 수행합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성분 검색 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": 200,
                              "message": "요청에 성공했습니다.",
                              "data": [
                                {
                                  "id": "maltitol",
                                  "name": "말티톨",
                                  "engName": "Maltitol",
                                  "category": "감미료",
                                  "riskLevel": "주의"
                                }
                              ]
                            }
                            """))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": 400,
                              "message": "검색어를 입력해주세요.",
                              "data": []
                            }
                            """)))
    })
    @GetMapping("/search")
    BaseResponse<List<EncyclopediaSearchResponse>> search(
            @Parameter(description = "검색 키워드 (예: 말티톨, 말티 등)", required = true)
            @RequestParam String query
    );
}
