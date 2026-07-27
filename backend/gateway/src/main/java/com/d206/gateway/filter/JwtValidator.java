package com.d206.gateway.filter;

import java.nio.charset.StandardCharsets;
import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// auth JwtTokenProvider의 파싱 로직만 복사 (HS256, subject=userId). 만료/서명 오류는 예외로 던진다.
@Component
public class JwtValidator {

    private final Key jwtKey;

    public JwtValidator(@Value("${jwt.secret}") String secretKey) {
        this.jwtKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // 검증 성공 시 userId(subject) 반환, 실패 시 JJWT 예외 전파 (Expired/Signature/Malformed 등)
    public String validate(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
