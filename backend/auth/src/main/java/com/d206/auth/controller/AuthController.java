package com.d206.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.d206.auth.dto.ApiResponse;
import com.d206.auth.dto.JwtTokenDto;
import com.d206.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@GetMapping("/createToken/{userId}")
	public ApiResponse<JwtTokenDto> createToken(@PathVariable Long userId) {
		return ApiResponse.success(authService.createToken(userId));
	}

	@PostMapping("/refresh")
	public ApiResponse<JwtTokenDto> refreshToken(@RequestBody JwtTokenDto jwtTokenDto) {
		return ApiResponse.success(authService.refreshToken(jwtTokenDto.getRefreshToken()));
	}

	@PostMapping("/validate")
	public ApiResponse<Long> validateToken(@RequestBody JwtTokenDto jwtTokenDto) {
		System.out.println("request token: " + jwtTokenDto.getAccessToken());
		return ApiResponse.success(authService.validateToken(jwtTokenDto.getAccessToken()));
	}

	@PostMapping("/invalidate")
	public ApiResponse<Long> invalidateToken(@RequestBody JwtTokenDto jwtTokenDto) {
		System.out.println("request token: " + jwtTokenDto.getAccessToken());
		return ApiResponse.success(authService.invalidateToken(jwtTokenDto.getAccessToken()));
	}

}
