package com.d206.auth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.d206.auth.dto.ApiResponse;
import com.d206.auth.dto.JwtTokenDto;
import com.d206.auth.dto.ValidateDto;
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

	@PostMapping("/validate")
	public ApiResponse<Long> validateToken(@RequestBody ValidateDto validateDto) {
		System.out.println("request token: " + validateDto.getAccessToken());
		return ApiResponse.success(authService.validateToken(validateDto.getAccessToken()));
	}

}
