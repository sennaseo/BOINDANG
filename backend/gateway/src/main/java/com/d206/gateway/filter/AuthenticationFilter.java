package com.d206.gateway.filter;

import java.util.List;

import com.d206.gateway.dto.ApiResponses;
import com.d206.gateway.dto.ErrorResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter implements GlobalFilter, Ordered {
    private final JwtValidator jwtValidator;
    private final ReactiveStringRedisTemplate redisTemplate;
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

        String token = extractToken(request, path);
        if (token == null) {
            return onError(exchange, "Authorization 헤더가 없거나 형식이 잘못되었습니다.", HttpStatus.UNAUTHORIZED);
        }

        String userId;
        try {
            userId = jwtValidator.validate(token);
        } catch (Exception e) {
            log.warn("JWT 검증 실패: {}", e.getMessage());
            return unauthorized(exchange, "유효하지 않은 토큰입니다.");
        }

        // 블랙리스트(로그아웃 토큰) 확인. Redis 장애 시엔 통과시킨다.
        // ponytail: Redis 장애 시 fail-open, 로그아웃 편의 기능 하나 때문에 전 서비스 인증이 죽는 게 더 나쁨.
        //           강한 격리가 필요하면 fail-closed + 로컬 캐시/서킷브레이커로 업그레이드.
        return redisTemplate.hasKey(token)
                .onErrorResume(e -> {
                    log.warn("Redis 블랙리스트 조회 실패, 통과 처리: {}", e.getMessage());
                    return Mono.just(false);
                })
                .flatMap(blacklisted -> {
                    if (Boolean.TRUE.equals(blacklisted)) {
                        return unauthorized(exchange, "로그아웃된 토큰입니다.");
                    }
                    ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                            .header("X-User-Id", userId)
                            .header("token", token)
                            .build();
                    return chain.filter(exchange.mutate().request(modifiedRequest).build());
                });
    }

    // /user/refresh는 refresh_token 우선, 그 외는 access_token 우선. 쿠키 없으면 Authorization Bearer 폴백.
    private String extractToken(ServerHttpRequest request, String path) {
        String cookieName = path.equals("/user/refresh") ? "refresh_token" : "access_token";
        HttpCookie cookie = request.getCookies().getFirst(cookieName);
        if (cookie != null) {
            return cookie.getValue();
        }
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // 프론트 계약: HTTP 200 + {success:false, error:{status:"UNAUTHORIZED", ...}}
    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        ApiResponses<?> body = ApiResponses.error(new ErrorResponse(HttpStatus.UNAUTHORIZED, message));
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.OK);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes;
        try {
            bytes = new ObjectMapper().writeValueAsBytes(body);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
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
