package com.d206.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URI;

import static org.springframework.cloud.gateway.support.ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR;

@Component
public class LoggingGlobalFilter implements GlobalFilter {

    private final Logger logger = LoggerFactory.getLogger(LoggingGlobalFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        Route route = exchange.getAttribute(GATEWAY_ROUTE_ATTR);

        // 요청 로깅
        logRequest(request);

        // 라우팅 정보 로깅
        if (route != null) {
            logger.info("Route ID: {}, URI: {}", route.getId(), route.getUri());
        }

        return chain.filter(exchange)
                .then(Mono.fromRunnable(() -> {
                    // 응답 로깅 (필터 체인 완료 후)
                    logResponse(response);
                }));
    }

    private void logRequest(ServerHttpRequest request) {
        URI uri = request.getURI();
        String method = request.getMethod().toString();
        HttpHeaders headers = request.getHeaders();

        logger.info("Incoming Request: {} {}", method, uri);
        logger.info("Request Headers: {}", headers);
    }

    private void logResponse(ServerHttpResponse response) {
        int statusCode = response.getStatusCode().value();
        HttpHeaders headers = response.getHeaders();

        logger.info("Outgoing Response: Status Code {}", statusCode);
        logger.info("Response Headers: {}", headers);
    }
}
