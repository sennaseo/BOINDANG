package com.boindang.community.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long userId; // MSA 기반 외래키. USER 서비스 참조

	private String category;

	@Lob
	@Column(nullable = false)
	private String content;

	private Long imageId;

	@Column(nullable = false)
	private boolean isDeleted = false;

	@Column(nullable = false)
	private int commentCount = 0;

	@Column(nullable = false)
	private int likeCount = 0;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(nullable = false)
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = this.updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	// 댓글/좋아요 수 갱신 메서드
	public void increaseCommentCount() {
		this.commentCount++;
	}

	public void decreaseCommentCount() {
		if (this.commentCount > 0) this.commentCount--;
	}

	public void increaseLikeCount() {
		this.likeCount++;
	}

	public void decreaseLikeCount() {
		if (this.likeCount > 0) this.likeCount--;
	}

	public void softDelete() {
		this.isDeleted = true;
	}
}
