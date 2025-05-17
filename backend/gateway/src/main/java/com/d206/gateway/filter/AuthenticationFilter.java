package com.d206.gateway.filter;

import java.util.List;
import java.util.Map;

import com.d206.gateway.dto.ApiResponses;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
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
        if (excludedPatterns.stream().anyMatch(pattern -> pathMatcher.match(pattern, path))) {
            log.info("인증이 필요 없는 경로입니다. 필터 체인 계속 진행: {}", path);
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
                .bodyToMono(ApiResponses.class)
                .flatMap(apiResponses -> {
                    log.info("apiResponses 받음(flatMap)");
                    if (!apiResponses.isSuccess()) {
                        ServerHttpResponse response = exchange.getResponse();
                        response.setStatusCode(HttpStatus.OK);
                        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
                        byte[] bytes;
                        try {
                            bytes = new ObjectMapper().writeValueAsBytes(apiResponses);
                        } catch (JsonProcessingException e) {
                            log.info("json 변환 중 예외 발생");
                            throw new RuntimeException(e);
                        }
                        DataBuffer buffer = response.bufferFactory().wrap(bytes);
                        return response.writeWith(Mono.just(buffer));
                    } else {
                        ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                                .header("X-User-Id", String.valueOf(apiResponses.getData()))
                                .build();
                        return chain.filter(exchange.mutate().request(modifiedRequest).build());
                    }
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
}
