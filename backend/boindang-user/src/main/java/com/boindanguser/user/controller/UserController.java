package com.boindanguser.user.controller;

import java.util.List;
import java.util.Map;

import com.boindanguser.common.model.dto.ApiResponse;
import com.boindanguser.user.model.dto.JwtTokenDto;
import com.boindanguser.user.model.dto.request.ChangeNicknameRequest;
import com.boindanguser.user.model.dto.request.UpdateUserRequest;
import com.boindanguser.user.model.dto.request.UserLoginRequest;
import com.boindanguser.user.service.UserService;
import com.boindanguser.user.model.dto.request.UserSignupRequest;
import com.boindanguser.user.model.dto.response.UserResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
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

    @PostMapping("/logout")
    public ApiResponse<?> logout(@RequestHeader("X-User-Id") Long userId) {
        return ApiResponse.success(userService.logout(userId));
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

    @GetMapping("/check-username")
    public ApiResponse<Boolean> checkUsernameExists(@RequestParam String username) {
        return ApiResponse.success(userService.isUsernameTaken(username));
    }

    @Operation(summary = "사용자 닉네임 일괄 조회", description = "커뮤니티 서비스 백엔드를 위한 코드입니당~~")
    @PostMapping("/users/batch")
    public ApiResponse<Map<Long, String>> getUsernames(@RequestBody List<Long> userIds) {
        Map<Long, String> result = userService.getUsernamesByIds(userIds);
        return ApiResponse.success(result);
    }

    @Operation(summary = "사용자 닉네임 조회", description = "커뮤니티 서비스 백엔드를 위한 코드입니다람쥐~~")
    @GetMapping("/users/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        return ApiResponse.success(userService.getUserInfo(id));
    }

}
