package com.boindang.community.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.boindang.community.entity.Post;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostSummaryResponse {

	private Long postId;
	private String category;
	private String content;
	private Long imageId;

	private String username;       // USER 서비스에서 가져옴

	private int commentCount;
	private int likeCount;
	private boolean likedByMe;     // 현재 사용자가 좋아요 눌렀는지 여부

	private LocalDateTime createdAt;

	public static PostSummaryResponse from(Post post, boolean likedByMe, String username) {
		return PostSummaryResponse.builder()
			.postId(post.getId())
			.category(post.getCategory())
			.content(post.getContent())
			.imageId(post.getImageId())
			.username(username)
			.commentCount(post.getCommentCount())
			.likeCount(post.getLikeCount())
			.likedByMe(likedByMe)
			.createdAt(post.getCreatedAt())
			.build();
	}
}
