package com.boindanguser.user.controller;

import com.boindanguser.common.model.dto.ApiResponse;
import com.boindanguser.user.model.dto.JwtTokenDto;
import com.boindanguser.user.model.dto.request.ChangeNicknameRequest;
import com.boindanguser.user.model.dto.request.UpdateUserRequest;
import com.boindanguser.user.model.dto.request.UserLoginRequest;
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

    @PostMapping("/login")
    public ApiResponse<JwtTokenDto> login(@RequestBody @Valid UserLoginRequest request) {
        // 여기서 성공하면 인증서버로 요청
        return ApiResponse.success(userService.login(request));
    }

    @DeleteMapping("/delete")
    public ApiResponse<String> delete(@RequestHeader("X-User-Id") Long userId) {
        userService.deleteUserById(userId);
        return ApiResponse.success("회원 탈퇴가 완료되었습니다.");
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMyInfo(@RequestHeader("X-User-Id") Long userId) {
        return ApiResponse.success(userService.getUserInfo(userId));
    }

    @PatchMapping("/me")
    public ApiResponse<UserResponse> updateUser(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid UpdateUserRequest request
    ) {
        return ApiResponse.success(userService.updateUser(userId, request));
    }


    @PostMapping("/nickname")
    public ApiResponse<String> changeNickname(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid ChangeNicknameRequest request
    ) {
        userService.changeNickname(userId, request.getNickname());
        return ApiResponse.success("닉네임이 성공적으로 변경되었습니다.");
    }


}
