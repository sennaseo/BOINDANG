package com.boindanguser.user.model.entity;

import com.boindanguser.user.model.type.UserType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // 이메일

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    @Column(nullable = false)
    @Pattern(regexp = "^[MF]$", message = "성별은 M 또는 F만 허용됩니다.")
    private String gender;

    @Column(nullable = false)
    private Double height; // 키 (cm 단위)

    @Column(nullable = false)
    private Double weight; // 몸무게 (kg 단위)
}
