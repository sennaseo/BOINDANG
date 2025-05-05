package com.boindang.encyclopedia.presentation;

import com.boindang.encyclopedia.application.PopularIngredientService;
import com.boindang.encyclopedia.common.response.BaseResponse;
import com.boindang.encyclopedia.presentation.dto.PopularIngredientResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ingredients")
public class PopularIngredientController implements PopularIngredientApi {

    private final PopularIngredientService popularIngredientService;

    @Override
    public BaseResponse<List<PopularIngredientResponse>> getPopularIngredients(int limit) {
        return BaseResponse.success(popularIngredientService.getTopIngredients(limit));
    }
}

