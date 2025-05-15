package com.boindang.community.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

import com.boindang.community.entity.Post;

@Getter
@Builder
public class PostResponse {

	private Long postId;
	private String category;
	private String content;
	private Long imageId;

	private String username;       // USER 서비스에서 가져옴

	private int commentCount;
	private int likeCount;
	private boolean likedByMe;     // 현재 사용자가 좋아요 눌렀는지 여부

	private LocalDateTime createdAt;
	private List<CommentResponse> comments;

	public static PostResponse from(Post post, boolean likedByMe, String username, List<CommentResponse> comments) {
		return PostResponse.builder()
			.postId(post.getId())
			.category(post.getCategory())
			.content(post.getContent())
			.imageId(post.getImageId())
			.username(username)
			.commentCount(post.getCommentCount())
			.likeCount(post.getLikeCount())
			.likedByMe(likedByMe)
			.createdAt(post.getCreatedAt())
			.comments(comments)
			.build();
	}
}