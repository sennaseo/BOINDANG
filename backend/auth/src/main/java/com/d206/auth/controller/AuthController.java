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

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/createToken/{userId}")
    public JwtTokenDto createToken(@PathVariable Long userId) {
        return authService.createToken(userId);
    }

    @GetMapping("/refresh/{userId}")
    public String refreshToken(@PathVariable Long userId) {
        return authService.refreshToken(userId);
    }

    @PostMapping("/validate")
    public Long validateToken(@RequestBody Map<String, String> body) {
        return authService.validateToken(body.get("token"));
    }

    @PostMapping("/invalidate")
    public Boolean invalidateToken(@RequestBody Map<String, String> body) {
        return authService.invalidateToken(body.get("token"));
    }

}
