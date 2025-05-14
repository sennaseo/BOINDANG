package com.boindang.community.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "게시글 작성 Request DTO")
public class CreatePostRequest {

	@NotBlank(message = "제목은 필수 입력값입니다.")
	@Schema(description = "게시글 제목", example = "오늘 점심 뭐 먹지?")
	private String title;

	@NotBlank(message = "내용은 필수 입력값입니다.")
	@Schema(description = "게시글 내용", example = "저는 고단백 도시락 먹었습니다.")
	private String content;

	@Schema(description = "게시글 이미지 ID")
	private Long imageId;
}
