package com.boindanguser.user.service;

import com.boindanguser.user.model.entity.User;
import com.boindanguser.user.model.type.UserType;
import com.boindanguser.user.repository.UserRepository;
import com.boindanguser.user.model.dto.request.UserSignupRequest;
import com.boindanguser.user.model.dto.response.UserResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserResponse signup(UserSignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }


        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .userType(UserType.valueOf(request.getUserType()))
                .gender(request.getGender())
                .height(request.getHeight())
                .weight(request.getWeight())
                .build();

        User saved = userRepository.save(user);
        return UserResponse.from(saved);
    }
}
