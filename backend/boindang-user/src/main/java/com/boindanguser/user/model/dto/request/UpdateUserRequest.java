package com.boindanguser.user.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @Pattern(regexp = "^[MF]$", message = "성별은 M 또는 F만 허용됩니다.")
    private String gender;

    @Min(50)
    @Max(250)
    private Double height;

    @Min(20)
    @Max(200)
    private Double weight;

    @Pattern(regexp = "^(다이어트|근성장|당뇨병|신장질환)$", message = "userType은 다이어트, 근성장, 당뇨병, 신장질환 중 하나여야 합니다.")
    private String userType;

    @Size(min = 1, max = 20)
    private String nickname;
}
