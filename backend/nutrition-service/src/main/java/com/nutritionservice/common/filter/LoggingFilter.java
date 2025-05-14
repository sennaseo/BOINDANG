package com.nutritionservice.common.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class LoggingFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {
        System.out.println("📌 LoggingFilter 초기화됨");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        long startTime = System.currentTimeMillis();

        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();
        String userId = httpRequest.getHeader("X-User-Id");

        System.out.println("📥 [API 요청] " + method + " " + uri);
        if (userId != null) {
            System.out.println("🔑 X-User-Id: " + userId);
        }

        // 다음 필터 또는 실제 컨트롤러로 요청 전달
        chain.doFilter(request, response);

        long duration = System.currentTimeMillis() - startTime;
        System.out.println("📤 [API 응답 완료] 처리 시간: " + duration + "ms");
    }

    @Override
    public void destroy() {
        System.out.println("📌 LoggingFilter 종료됨");
    }
}
