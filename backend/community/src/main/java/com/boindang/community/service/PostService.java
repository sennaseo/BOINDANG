package com.boindang.community.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.boindang.community.client.UserClient;
import com.boindang.community.common.exception.CommunityException;
import com.boindang.community.common.exception.ErrorCode;
import com.boindang.community.dto.request.CreatePostRequest;
import com.boindang.community.dto.response.CommentResponse;
import com.boindang.community.dto.response.PostListResponse;
import com.boindang.community.dto.response.PostResponse;
import com.boindang.community.dto.response.PostSummaryResponse;
import com.boindang.community.entity.Comment;
import com.boindang.community.entity.Post;
import com.boindang.community.repository.CommentRepository;
import com.boindang.community.repository.LikeRepository;
import com.boindang.community.repository.PostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

	private final PostRepository postRepository;
	private final LikeRepository likeRepository;
	private final CommentRepository commentRepository;
	private final UserClient userClient;

	public PostListResponse getAllPosts(Long currentUserId, String category, int size, int page) {
		PageRequest pageRequest = PageRequest.of(page, size);
		Page<Post> postPage;

		// ✅ 카테고리 조건 분기
		if (category == null) {
			postPage = postRepository.findAllByIsDeletedFalseOrderByCreatedAtDesc(pageRequest);
		} else {
			postPage = postRepository.findAllByIsDeletedFalseAndCategoryOrderByCreatedAtDesc(category, pageRequest);
		}

		List<Post> posts = postPage.getContent();

		// userId 목록 추출 후 중복 제거
		List<Long> userIds = posts.stream()
			.map(Post::getUserId)
			.distinct()
			.toList();

		// USER 서비스에 배치 요청
		Map<Long, String> usernames = userClient.getUsernamesByIds(userIds);

		// 최종 매핑
		List<PostSummaryResponse> responseList = posts.stream()
			.map(post -> {
				boolean likedByMe = likeRepository.existsByPostIdAndUserIdAndIsDeletedFalse(post.getId(), currentUserId);
				String username = usernames.getOrDefault(post.getUserId(), "알 수 없음");
				return PostSummaryResponse.from(post, likedByMe, username);
			})
			.toList();

		return new PostListResponse(postPage.getTotalPages(), responseList);
	}

	public PostResponse getPostById(Long postId, Long currentUserId) {
		Post post = postRepository.findByIdAndIsDeletedFalse(postId)
			.orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다."));

		boolean likedByMe = likeRepository.existsByPostIdAndUserIdAndIsDeletedFalse(postId, currentUserId);
		String username = userClient.getUsernameById(post.getUserId());

		// ✅ 댓글 조회 (isDeleted == false 조건 포함)
		List<Comment> comments = commentRepository.findByPostIdAndIsDeletedFalseOrderByCreatedAtAsc(postId);

		// 댓글 작성자 ID 목록 추출 후 USER 서비스에 batch 요청
		List<Long> commenterIds = comments.stream()
			.map(Comment::getUserId)
			.distinct()
			.toList();

		Map<Long, String> nicknames = userClient.getUsernamesByIds(commenterIds);

		// ✅ 댓글 → DTO 변환
		List<CommentResponse> commentResponses = comments.stream()
			.map(comment -> {
				String nickname = nicknames.getOrDefault(comment.getUserId(), "알 수 없음");
				return CommentResponse.from(comment, currentUserId, nickname);
			})
			.toList();

		return PostResponse.from(post, likedByMe, username, commentResponses);
	}

	public Long createPost(Long userId, CreatePostRequest request) {
		Post post = Post.builder()
			.userId(userId)
			.category(request.getCategory())
			.title(request.getTitle())
			.content(request.getContent())
			.imageId(request.getImageId())
			.build();

		postRepository.save(post);
		return post.getId();
	}

	public void deletePost(Long postId, Long userId) {
		Post post = postRepository.findByIdAndIsDeletedFalse(postId)
			.orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다."));

		if (!post.getUserId().equals(userId)) {
			throw new CommunityException(ErrorCode.FORBIDDEN_DELETE_POST);
		}

		post.softDelete();
		postRepository.save(post);
	}

}
