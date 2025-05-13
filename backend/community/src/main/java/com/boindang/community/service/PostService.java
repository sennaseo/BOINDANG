package com.boindang.community.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boindang.community.client.UserClient;
import com.boindang.community.dto.request.CreatePostRequest;
import com.boindang.community.dto.response.PostResponse;
import com.boindang.community.entity.Like;
import com.boindang.community.entity.Post;
import com.boindang.community.repository.LikeRepository;
import com.boindang.community.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

	private final PostRepository postRepository;
	private final LikeRepository likeRepository;
	private final UserClient userClient;

	public List<PostResponse> getAllPosts(Long currentUserId) {
		List<Post> posts = postRepository.findAllByIsDeletedFalseOrderByCreatedAtDesc();

		return posts.stream()
			.map(post -> {
				boolean likedByMe = likeRepository.existsByPostIdAndUserIdAndIsDeletedFalse(post.getId(), currentUserId);
				String username = userClient.getUsernameById(post.getUserId());
				return PostResponse.from(post, likedByMe, username);
			})
			.toList();
	}

	public PostResponse getPostById(Long postId, Long currentUserId) {
		Post post = postRepository.findByIdAndIsDeletedFalse(postId)
			.orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다."));

		boolean likedByMe = likeRepository.existsByPostIdAndUserIdAndIsDeletedFalse(postId, currentUserId);
		String username = userClient.getUsernameById(post.getUserId());

		return PostResponse.from(post, likedByMe, username);
	}

	public Long createPost(Long userId, CreatePostRequest request) {
		Post post = Post.builder()
			.userId(userId)
			.title(request.getTitle())
			.content(request.getContent())
			.build();

		postRepository.save(post);
		return post.getId();
	}

	public void deletePost(Long postId, Long userId) {
		Post post = postRepository.findByIdAndIsDeletedFalse(postId)
			.orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다."));

		if (!post.getUserId().equals(userId)) {
			throw new RuntimeException("본인의 게시글만 삭제할 수 있습니다.");
		}

		post.softDelete();
		postRepository.save(post);
	}

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
