package com.boindang.community.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.community.dto.response.ApiResponses;
import com.boindang.community.service.LikeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@Tag(name = "좋아요", description = "커뮤니티 좋아요 관련 API입니다.")
public class LikeController {

	private final LikeService likeService;
	@Operation(summary = "게시글 좋아요 토글", description = "좋아요를 누르거나 취소합니다. 첫 누르면 추가, 다시 누르면 취소됩니다.")
	@PostMapping("/{postId}/likes")
	public ApiResponses<String> toggleLike(
		@PathVariable Long postId,
		@RequestHeader("X-User-Id") String userId
	) {
		likeService.toggleLike(postId, Long.parseLong(userId));
		return ApiResponses.success("좋아요 누르기/취소가 완료되었습니다.");
	}

}
