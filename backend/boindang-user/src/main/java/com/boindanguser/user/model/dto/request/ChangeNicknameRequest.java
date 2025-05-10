package com.boindanguser.user.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeNicknameRequest {
    @NotBlank(message = "닉네임은 공백일 수 없습니다.")
    private String nickname;
}
