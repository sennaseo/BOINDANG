package com.d206.auth.service;

import io.jsonwebtoken.Claims;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.d206.auth.dto.JwtTokenDto;
import com.d206.auth.exception.JwtAuthenticationException;
import com.d206.auth.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;


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
        if (redisTemplate.hasKey(token)) {
            throw new JwtAuthenticationException("블랙리스트된 토큰입니다");
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new JwtAuthenticationException("유효하지 않은 토큰입니다.");
        }
        return jwtTokenProvider.getUserIdFromToken(token);
    }

    public boolean invalidateToken(String token) {
        Claims claims = jwtTokenProvider.parseClaims(token);
        Date expiration = claims.getExpiration();
        long now = System.currentTimeMillis();
        long ttl = expiration.getTime() - now;

        if (ttl <= 0) {
            return false;
        }
        redisTemplate.opsForValue().set(token, "INVALIDATED", ttl, TimeUnit.MILLISECONDS);
        return redisTemplate.opsForValue().get(token).equals("INVALIDATED");
    }

}
