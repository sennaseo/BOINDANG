package com.d206.gateway.filter;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.client.RestClient;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.EurekaClient;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter, Ordered {
	private final WebClient.Builder webClientBuilder;
	private final RestClient restClient;
	@Autowired
	private EurekaClient discoveryClient;
	private static final Logger log = LoggerFactory.getLogger(AuthenticationFilter.class);

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
		ServerHttpRequest request = exchange.getRequest();

		// 인증이 필요없는 엔드포인트 처리
		String path = request.getURI().getPath();
		AntPathMatcher pathMatcher = new AntPathMatcher();
		List<String> excludedPatterns = List.of(
				"/user/login",
				"/user/signup",
				"/user/check-username",
				"/**/swagger-ui/**",
				"/favicon.ico"
		);

		if (excludedPatterns.stream().anyMatch(pattern -> {
			boolean matches = pathMatcher.match(pattern, path);
			if (matches) {
				log.debug("제외된 패턴과 일치: 패턴 '{}', 경로 '{}'", pattern, path);
			}
			return matches;
		})) {
			log.info("인증이 필요 없는 경로입니다. 필터 체인 계속 진행: {}", path);
			return chain.filter(exchange);
		}

		if (excludedPatterns.stream().anyMatch(pattern -> pathMatcher.match(pattern, path))) {
			return chain.filter(exchange);
		}

		// jwt 검증
		String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
		}

		String token = authHeader.substring(7);
		Map<String, String> requestBody = Map.of("accessToken", token);

		return webClientBuilder.build()
			.post()
			.uri(getUrl("AUTH") + "auth/validate")
			.contentType(MediaType.APPLICATION_JSON)
			.bodyValue(requestBody)
			.retrieve()
			.onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
				clientResponse -> Mono.error(new RuntimeException("Unauthorized")))
			.bodyToMono(AuthResponse.class) // 인증 서버에서 userId 반환한다고 가정
			.flatMap(response -> {
				if (!response.isSuccess() || response.getResult() == null) {
					return onError(exchange, "Invalid token", HttpStatus.UNAUTHORIZED);
				}

				ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
					.header("X-User-Id", String.valueOf(response.getResult()))
					.build();
				return chain.filter(exchange.mutate().request(modifiedRequest).build());
			});
	}

	public String getUrl(String service) {
		InstanceInfo instance = discoveryClient.getNextServerFromEureka(service, false);
		return instance.getHomePageUrl();
	}

	private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus status) {
		exchange.getResponse().setStatusCode(status);
		return exchange.getResponse().setComplete();
	}

	@Override
	public int getOrder() {
		return -1;
	}

	@Data
	public static class AuthResponse {
		private boolean success;
		private int code;
		private String message;
		private Integer result; // userId
	}
}
