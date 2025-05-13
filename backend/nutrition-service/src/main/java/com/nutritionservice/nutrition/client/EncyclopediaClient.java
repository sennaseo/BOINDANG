package com.nutritionservice.nutrition.client;

import com.nutritionservice.nutrition.model.dto.external.EncyclopediaRequest;
import com.nutritionservice.nutrition.model.dto.external.EncyclopediaResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "encyclopediaClient", url = "${external.encyclopedia.url}")
public interface EncyclopediaClient {

    @PostMapping("/user-type")
    EncyclopediaResponse getIngredientDetails(@RequestHeader("Authorization") String token, @RequestBody EncyclopediaRequest request);
}
