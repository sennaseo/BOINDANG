package com.d206.auth.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request,
		HttpServletResponse response,
		AuthenticationException authException) throws IOException {

		// Authorization 헤더 확인
		String authHeader = request.getHeader("Authorization");
		String error;
		String msg;

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			error = "missing_token";
			msg = "액세스 토큰이 없거나 유효한 형식이 아닙니다.";
			log.error("인증 실패: 액세스 토큰 없음");
		} else {
			error = "invalid_token";
			msg = "유효하지 않은 액세스 토큰입니다.";
			log.error("인증 실패: 유효하지 않은 토큰 - {}", authException.getMessage());
		}

		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.getWriter().write("{\"message\": \"Unauthorized access.\"}");
	}
}
