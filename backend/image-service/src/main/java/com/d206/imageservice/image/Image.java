package com.d206.imageservice.image;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Image {
	@Id
	private Long imageId;

	@Column(nullable = false)
	private long userId;

	@Column(nullable = false)
	private String imageUrl;
}
