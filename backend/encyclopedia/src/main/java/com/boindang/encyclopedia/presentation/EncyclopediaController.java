package com.boindang.encyclopedia.presentation;

import com.boindang.encyclopedia.application.EncyclopediaService;
import com.boindang.encyclopedia.common.response.BaseResponse;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaSearchResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
@Tag(name = "백과사전", description = "영양 성분 백과사전 관련 API입니다.")
public class EncyclopediaController implements EncyclopediaApi {

    private final EncyclopediaService encyclopediaService;

    @PostMapping("/insert-data")
    public String insertSample() {
        encyclopediaService.saveIngredientData();
        return "샘플 성분 저장 완료!";
    }

    @Override
    public BaseResponse<List<EncyclopediaSearchResponse>> search(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return BaseResponse.fail(400, "검색어를 입력하세요.");
        }

        return BaseResponse.success(encyclopediaService.searchIngredients(query));
    }
}
