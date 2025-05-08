package com.boindanguser.user.controller;

import com.boindanguser.common.model.dto.ApiResponse;
import com.boindanguser.user.service.UserService;
import com.boindanguser.user.model.dto.request.UserSignupRequest;
import com.boindanguser.user.model.dto.response.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ApiResponse<UserResponse> signup(@RequestBody @Valid UserSignupRequest request) {
        return ApiResponse.success(userService.signup(request));
    }
}
