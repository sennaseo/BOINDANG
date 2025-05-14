package com.nutritionservice.nutrition.service;

import com.nutritionservice.common.model.dto.ApiResponse;
import com.nutritionservice.common.service.EurekaService;
import org.springframework.web.client.RestClient;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final RestClient restClient;
    private final EurekaService eurekaService;

    public UserInfo getUserById(String userId) {
        try {
            String url = eurekaService.getUrl("BOINDANG-USER") + "/me";
            System.out.println("🔍 사용자 정보 요청 URL: " + url);

            ApiResponse<UserInfo> response = restClient.get()
                    .uri(url)
                    .header("X-User-Id", userId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});

            return response.getResult();
        } catch (Exception e) {
            throw new RuntimeException("❌ 사용자 정보 요청 실패: " + e.getMessage(), e);
        }
    }
}

