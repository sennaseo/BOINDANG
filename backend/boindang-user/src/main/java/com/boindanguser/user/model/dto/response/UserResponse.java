package com.boindanguser.user.model.dto.response;

import com.boindanguser.user.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String nickname;
    private String userType;
    private String gender;
    private Double height;
    private Double weight;

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getUserType().name(), // enum → 문자열
                user.getGender(),
                user.getHeight(),
                user.getWeight()
        );
    }
}
