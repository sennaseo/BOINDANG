package com.boindanguser.user.controller;

import java.util.List;
import java.util.Map;

import com.boindanguser.common.model.dto.ApiResponse;
import com.boindanguser.common.model.dto.ApiResponses;
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
    public ApiResponses<UserResponse> signup(@RequestBody @Valid UserSignupRequest request) {
        return ApiResponses.success(userService.signup(request));
    }

    @PostMapping("/login")
    public ApiResponses<JwtTokenDto> login(@RequestBody @Valid UserLoginRequest request) {
        return ApiResponses.success(userService.login(request));
    }

    @GetMapping("/refresh")
    public ApiResponses<String> refresh(@RequestHeader("X-User-Id") Long userId) {
        return ApiResponses.success(userService.refresh(userId));
    }

    @DeleteMapping("/delete")
    public ApiResponses<String> delete(@RequestHeader("X-User-Id") Long userId) {
        userService.deleteUserById(userId);
        return ApiResponses.success("회원 탈퇴가 완료되었습니다.");
    }

    @GetMapping("/me")
    public ApiResponses<UserResponse> getMyInfo(@RequestHeader("X-User-Id") Long userId) {
        return ApiResponses.success(userService.getUserInfo(userId));
    }

    @PatchMapping("/me")
    public ApiResponses<UserResponse> updateUser(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid UpdateUserRequest request
    ) {
        return ApiResponses.success(userService.updateUser(userId, request));
    }


    @PostMapping("/nickname")
    public ApiResponses<String> changeNickname(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid ChangeNicknameRequest request
    ) {
        userService.changeNickname(userId, request.getNickname());
        return ApiResponses.success("닉네임이 성공적으로 변경되었습니다.");
    }

    @GetMapping("/check-username")
    public ApiResponses<Boolean> checkUsernameExists(@RequestParam String username) {
        return ApiResponses.success(userService.isUsernameTaken(username));
    }

    @Operation(summary = "사용자 닉네임 일괄 조회", description = "커뮤니티 서비스 백엔드를 위한 코드입니당~~")
    @PostMapping("/users/batch")
    public ApiResponses<Map<Long, String>> getUsernames(@RequestBody List<Long> userIds) {
        Map<Long, String> result = userService.getUsernamesByIds(userIds);
        return ApiResponses.success(result);
    }

    @Operation(summary = "사용자 닉네임 조회", description = "커뮤니티 서비스 백엔드를 위한 코드입니다람쥐~~")
    @GetMapping("/users/{id}")
    public ApiResponses<UserResponse> getUserById(@PathVariable Long id) {
        return ApiResponses.success(userService.getUserInfo(id));
    }

}
