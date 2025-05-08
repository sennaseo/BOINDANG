package com.boindanguser.user.service;

import com.boindanguser.user.model.dto.request.UpdateUserRequest;
import com.boindanguser.user.model.dto.request.UserLoginRequest;
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

    public UserResponse login(UserLoginRequest request) {
        User user = userRepository.findByUsername(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return UserResponse.from(user);
    }


    public void deleteUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));
        userRepository.delete(user);
    }

    public UserResponse getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));
        return UserResponse.from(user);
    }

    public void changeNickname(Long userId, String newNickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        user.setNickname(newNickname);
        userRepository.save(user);
    }


    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getHeight() != null) {
            user.setHeight(request.getHeight());
        }
        if (request.getWeight() != null) {
            user.setWeight(request.getWeight());
        }
        if (request.getUserType() != null) {
            user.setUserType(UserType.valueOf(request.getUserType()));
        }
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }

        userRepository.save(user);
        return UserResponse.from(user);
    }

}
