package com.boindang.community.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(description = "게시글 작성 응답 DTO")
public class CreatePostResponse {

	@Schema(description = "생성된 게시글 ID", example = "42")
	private Long postId;
}

