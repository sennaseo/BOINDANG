package com.boindang.community.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "likes", uniqueConstraints = {
	@UniqueConstraint(columnNames = {"postId", "userId"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Like {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long postId;

	@Column(nullable = false)
	private Long userId;

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

	public void restore() {
		this.isDeleted = false;
	}
}
