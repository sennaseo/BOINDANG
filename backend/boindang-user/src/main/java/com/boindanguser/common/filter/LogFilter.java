package com.boindanguser.common.filter;

import java.io.IOException;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebFilter(filterName = "logFilter", urlPatterns = "/*")
public class LogFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(LogFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 필터 초기화 코드 (필요시)
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // 요청 정보 로그 출력
        logger.info("Request received: URI = " + request.getRemoteAddr());

        // 필터 체인 실행 (다음 필터 또는 실제 요청 처리로 이동)
        chain.doFilter(request, response);
    }
}