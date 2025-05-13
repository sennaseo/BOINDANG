package com.boindang.encyclopedia.presentation;

import com.boindang.encyclopedia.application.PopularIngredientService;
import com.boindang.encyclopedia.common.response.BaseResponse;
import com.boindang.encyclopedia.presentation.api.PopularIngredientApi;
import com.boindang.encyclopedia.presentation.dto.response.PopularIngredientResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class PopularIngredientController implements PopularIngredientApi {

    private final PopularIngredientService popularIngredientService;

    @Override
    @GetMapping("/popular")
    public BaseResponse<List<PopularIngredientResponse>> getPopularIngredients(
        @RequestParam(defaultValue = "3") int limit
    ) {
        return BaseResponse.success(popularIngredientService.getTopIngredients(limit));
    }
}

