package com.boindang.community.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

import com.boindang.community.entity.Post;

@Getter
@Builder
public class PostResponse {

	private Long postId;
	private String title;
	private String content;

	private Long userId;
	private String username;       // USER 서비스에서 가져옴

	private int commentCount;
	private int likeCount;
	private boolean likedByMe;     // 현재 사용자가 좋아요 눌렀는지 여부

	private LocalDateTime createdAt;

	public static PostResponse from(Post post, boolean likedByMe, String username) {
		return PostResponse.builder()
			.postId(post.getId())
			.title(post.getTitle())
			.content(post.getContent())
			.userId(post.getUserId())
			.username(username)
			.commentCount(post.getCommentCount())
			.likeCount(post.getLikeCount())
			.likedByMe(likedByMe)
			.createdAt(post.getCreatedAt())
			.build();
	}
}