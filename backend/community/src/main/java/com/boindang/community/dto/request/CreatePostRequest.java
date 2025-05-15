package com.boindang.community.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "게시글 작성 Request DTO")
public class CreatePostRequest {

	@NotBlank(message = "카테고리는 필수 입력값입니다.")
	@Schema(description = "게시글 카테고리", example = "식단")
	private String category;

	@NotBlank(message = "내용은 필수 입력값입니다.")
	@Schema(description = "게시글 내용", example = "저는 고단백 도시락 먹었습니다.")
	private String content;

	@Schema(description = "게시글 이미지 ID")
	private Long imageId;
}
