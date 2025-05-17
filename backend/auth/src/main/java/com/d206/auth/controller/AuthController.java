package com.d206.auth.controller;

import com.d206.auth.common.ApiResponses;
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

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@GetMapping("/createToken/{userId}")
	public ApiResponses<JwtTokenDto> createToken(@PathVariable Long userId) {
		return ApiResponses.success(authService.createToken(userId));
	}

	@GetMapping("/refresh/{userId}")
	public ApiResponses<String> refreshToken(@PathVariable Long userId) {
		return ApiResponses.success(authService.refreshToken(userId));
	}

	@PostMapping("/validate")
	public ApiResponses<Long> validateToken(@RequestBody Map<String, String> body) {
		return ApiResponses.success(authService.validateToken(body.get("authHeader").substring(7)));
	}

	@PostMapping("/invalidate")
	public ApiResponses<Boolean> invalidateToken(@RequestBody Map<String, String> body) {
		return ApiResponses.success(authService.invalidateToken(body.get("authHeader").substring(7)));
	}

}
