package com.boindanguser.user.model.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupRequest {
    private String username;
    private String password;
    private String nickname;
    private String userType;
}
