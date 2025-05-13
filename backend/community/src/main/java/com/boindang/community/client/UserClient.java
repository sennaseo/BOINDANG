package com.boindang.community.client;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.boindang.community.dto.response.ApiResponse;
import com.boindang.community.dto.response.UserResponse;

@Component
@RequiredArgsConstructor
public class UserClient {

	private final RestClient restClient;
	private final DiscoveryClient discoveryClient;

	public String getUsernameById(Long userId) {
		String baseUrl = discoveryClient.getInstances("USER")
			.stream()
			.findFirst()
			.map(instance -> instance.getUri().toString())
			.orElseThrow(() -> new RuntimeException("USER 서비스 인스턴스를 찾을 수 없습니다."));

		String url = baseUrl + "/users/" + userId;

		ApiResponse<UserResponse> response = restClient.get()
			.uri(url)
			.retrieve()
			.body(new ParameterizedTypeReference<>() {});

		return response.getResult().getUsername();
	}
}
