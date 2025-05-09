package com.boindang.encyclopedia;

import java.io.IOException;

import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class RequestLoggingFilter implements Filter {
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
		throws IOException, ServletException {

		HttpServletRequest httpRequest = (HttpServletRequest) request;

		// 요청 메서드와 URL 출력
		System.out.println("[REQUEST] " + httpRequest.getMethod() + " " + httpRequest.getRequestURI());

		// 헤더 정보 출력 (원한다면)
		httpRequest.getHeaderNames().asIterator()
			.forEachRemaining(headerName ->
				System.out.println("[HEADER] " + headerName + ": " + httpRequest.getHeader(headerName)));

		// 필터 체인 계속 진행
		chain.doFilter(request, response);
	}
}
