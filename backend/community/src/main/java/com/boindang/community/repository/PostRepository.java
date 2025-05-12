package com.boindang.community.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.boindang.community.entity.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
	List<Post> findAllByIsDeletedFalseOrderByCreatedAtDesc();
	Optional<Post> findByIdAndIsDeletedFalse(Long id);
}
