package com.d206.auth.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.d206.auth.exception.JwtAuthenticationException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenProvider {

    private final Key jwtKey;

    @Value("${jwt.access-token.expire-time}")
    private long ACCESS_TOKEN_EXPIRE_TIME;

    @Value("${jwt.refresh-token.expire-time}")
    private long REFRESH_TOKEN_EXPIRE_TIME;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey) {
        this.jwtKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // AccessToken 생성
    public String createAccessToken(Long userId) {
        return Jwts.builder()
            .setSubject(String.valueOf(userId))
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRE_TIME))
            .signWith(jwtKey, SignatureAlgorithm.HS256)
            .compact();
    }

    // RefreshToken 생성
    public String createRefreshToken() {
        return Jwts.builder()
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRE_TIME))
            .signWith(jwtKey, SignatureAlgorithm.HS256)
            .compact();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtKey)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 토큰에서 userId 추출
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(jwtKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
        return Long.valueOf(claims.getSubject());
    }

    public Boolean validateAccessToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtKey)
                .build()
                .parseClaimsJws(token)// 만료확인
                .getBody();
            String auth = claims.get("sub", String.class);
            log.info("sub={}", auth);
            return auth != null;
		} catch (SignatureException e) {
			log.error("Invalid JWT Signature", e);
			throw new JwtAuthenticationException("토큰이 올바르지 않습니다.");
		} catch (SecurityException | MalformedJwtException e) {
			log.warn("Invalid JWT Token", e);
			throw new JwtAuthenticationException("유효하지 않은 토큰입니다.");
		} catch (ExpiredJwtException e) {
			log.warn("Expired JWT Token", e);
			throw new JwtAuthenticationException("토큰이 만료되었습니다. 다시 로그인해주세요.");
		} catch (UnsupportedJwtException e) {
			log.warn("Unsupported JWT Token", e);
			throw new JwtAuthenticationException("지원되지 않는 토큰 형식입니다.");
		} catch (IllegalArgumentException e) {
			log.warn("JWT claims string is empty", e);
			throw new JwtAuthenticationException("토큰에 필요한 정보가 부족합니다.");
		}
    }

    public Authentication getAuthentication(String token){

        Claims claims = parseClaims(token);
        if (claims.get("auth") == null) {
            throw new JwtAuthenticationException("권한 정보가 없는 토큰입니다");
        }

        // Claim에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
            .map(SimpleGrantedAuthority::new)
            .toList();

        Long userId = Long.parseLong(claims.getSubject());

        // 사용자 ID로 UserDetails 조회 (사용자 정보를 DB에서 새로 가져옴)
        UserDetails userDetails = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(userDetails, "", authorities);
    }

    // 복호화
    public Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(jwtKey)
                .build()
                .parseClaimsJws(token) // 토큰 검증 & 파싱
                .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}

