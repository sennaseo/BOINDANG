package com.boindanguser.user.controller;

import com.boindanguser.common.model.dto.ApiResponse;
import com.boindanguser.user.service.UserService;
import com.boindanguser.user.model.dto.request.UserSignupRequest;
import com.boindanguser.user.model.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ApiResponse<UserResponse> signup(@RequestBody UserSignupRequest request) {
        return ApiResponse.success(userService.signup(request));
    }
}
