package com.boindang.community.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boindang.community.entity.Like;
import com.boindang.community.entity.Post;
import com.boindang.community.repository.LikeRepository;
import com.boindang.community.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

	private final PostRepository postRepository;
	private final LikeRepository likeRepository;

	@Transactional
	public void toggleLike(Long postId, Long userId) {
		Post post = postRepository.findByIdAndIsDeletedFalse(postId)
			.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

		Optional<Like> existing = likeRepository.findByPostIdAndUserId(postId, userId);

		if (existing.isPresent()) {
			Like like = existing.get();
			if (like.isDeleted()) {
				like.restore();           // 좋아요 복구
				post.increaseLikeCount();
			} else {
				like.softDelete();       // 좋아요 취소
				post.decreaseLikeCount();
			}
			likeRepository.save(like);
		} else {
			Like newLike = Like.builder()
				.postId(postId)
				.userId(userId)
				.build();
			likeRepository.save(newLike);
			post.increaseLikeCount();
		}

		postRepository.save(post); // likeCount 갱신
	}
}
