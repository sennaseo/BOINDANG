package com.boindang.community.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Comment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long postId; // 연관 게시글 ID

	@Column(nullable = false)
	private Long userId;

	@Lob
	@Column(nullable = false)
	private String content;

	@Column(nullable = false)
	private boolean isDeleted = false;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}

	public void softDelete() {
		this.isDeleted = true;
	}
}
