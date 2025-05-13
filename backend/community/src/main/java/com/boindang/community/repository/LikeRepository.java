package com.boindang.community.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.boindang.community.entity.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
	boolean existsByPostIdAndUserIdAndIsDeletedFalse(Long postId, Long userId);
	Optional<Like> findByPostIdAndUserId(Long postId, Long userId);
}

