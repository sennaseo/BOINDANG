package com.d206.imageservice.image;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Image {
	@Id
	private Long imageId;

	@Column(nullable = false)
	private long userId;

	@Column(nullable = false)
	private String imageUrl;
}
