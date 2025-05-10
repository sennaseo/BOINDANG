package com.d206.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.d206.auth.common.ApiResponses;
import com.d206.auth.dto.ApiResponse;
import com.d206.auth.dto.JwtTokenDto;
import com.d206.auth.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final JwtTokenProvider jwtTokenProvider;

	@GetMapping("/createToken/{userId}")
	public ApiResponse<JwtTokenDto> createAccessToken(@PathVariable Long userId) {
		System.out.println("Request: " + userId);
		JwtTokenDto jwtTokenDto = JwtTokenDto.builder()
			.accessToken(jwtTokenProvider.createAccessToken(userId))
			.refreshToken(jwtTokenProvider.createRefreshToken())
			.build();
		return ApiResponse.success(jwtTokenDto);
	}

}
