package com.d206.imageservice.image;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Image {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long imageId;

	@Column(nullable = false)
	private long userId;

	@Column(nullable = false)
	private String imageUrl;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	@Column(nullable = true)
	private LocalDateTime  deletedAt;
}
