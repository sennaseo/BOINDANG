package com.boindanguser.user.model.dto.request;

import com.boindanguser.user.model.type.EnumValidator;
import com.boindanguser.user.model.type.UserType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupRequest {
    private String username;
    private String password;
    private String nickname;
    @EnumValidator(enumClass = UserType.class, message = "userType은 다이어트, 근성장, 당뇨병, 신장질환 중 하나여야 합니다.")
    private String userType;
    private String gender;
    private Double height;
    private Double weight;
}
