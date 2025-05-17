package com.d206.auth.service;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.d206.auth.dto.JwtTokenDto;
import com.d206.auth.exception.JwtAuthenticationException;
import com.d206.auth.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.logging.Logger;

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

    public String refreshToken(Long userId) {
        return createToken(userId).getAccessToken();
    }

    public Long validateToken(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new JwtAuthenticationException("유효하지 않은 액세스 토큰입니다.");
        }
        return jwtTokenProvider.getUserIdFromToken(token);
    }

    //TODO
    public Long invalidateToken(String accessToken) {

        return null;
    }


}
