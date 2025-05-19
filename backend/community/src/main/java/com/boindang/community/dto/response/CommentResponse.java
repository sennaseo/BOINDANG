package com.boindang.community.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

import com.boindang.community.entity.Comment;

@Getter
@Builder
public class CommentResponse {
	private Long commentId;
	private Long authorId;
	private String authorNickname;
	private String content;
	private boolean isMine;
	private LocalDateTime createdAt;

	public static CommentResponse from(Comment comment, Long currentUserId, String authorNickname) {
		return CommentResponse.builder()
			.commentId(comment.getId())
			.authorId(comment.getUserId())
			.authorNickname(authorNickname)
			.content(comment.getContent())
			.isMine(comment.getUserId().equals(currentUserId))
			.createdAt(comment.getCreatedAt())
			.build();
	}
}
