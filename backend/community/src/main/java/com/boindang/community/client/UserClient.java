package com.boindang.community.client;

import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.boindang.community.dto.response.ApiResponses;
import com.boindang.community.dto.response.UserResponse;
import com.boindang.community.service.EurekaService;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserClient {

	private final RestClient restClient;
	private final EurekaService eurekaService;

	public String getUsernameById(Long userId) {
		try {
			String url = eurekaService.getUrl("BOINDANG-USER") + "users/" + userId;
			ApiResponse<UserResponse> apiResponse = restClient.get()
				.uri(url)
				.retrieve()
				.body(new ParameterizedTypeReference<>() {});
			return apiResponse.getResult().getNickname();
		} catch (Exception e) {
			throw new RuntimeException("유저 이름 조회 실패: " + e.getMessage(), e);
		}
	}

	public Map<Long, String> getUsernamesByIds(List<Long> userIds) {
		try {
			String url = eurekaService.getUrl("BOINDANG-USER") + "users/batch";
			log.info("🩵url = " + url);
			ApiResponses<Map<Long, String>> apiResponse = restClient.post()
				.uri(url)
				.body(userIds)
				.retrieve()
				.body(new ParameterizedTypeReference<>() {});
			return apiResponse.getData();
		} catch (Exception e) {
			throw new RuntimeException("유저명 배치 조회 실패: " + e.getMessage(), e);
		}
	}
}
