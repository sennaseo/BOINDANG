package com.d206.auth.service;

import org.springframework.stereotype.Service;

import com.d206.auth.dto.JwtTokenDto;
import com.d206.auth.exception.JwtAuthenticationException;
import com.d206.auth.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final JwtTokenProvider jwtTokenProvider;

	public JwtTokenDto createToken(Long userId) {
		System.out.println("Request: " + userId);
		return JwtTokenDto.builder()
			.accessToken(jwtTokenProvider.createAccessToken(userId))
			.refreshToken(jwtTokenProvider.createRefreshToken(userId))
			.build();
	}

	//TODO
	public JwtTokenDto refreshToken(String refreshToken) {
		if(!jwtTokenProvider.validateToken(refreshToken)){

		}
		return null;
	}

	public Long validateToken(String accessToken) {
		if (!jwtTokenProvider.validateToken(accessToken)) {
			throw new JwtAuthenticationException("유효하지 않은 액세스 토큰입니다.");
		}
		return jwtTokenProvider.getUserIdFromToken(accessToken);
	}

	//TODO
    public Long invalidateToken(String accessToken) {
		return null;
    }


}
