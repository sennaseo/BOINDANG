package com.boindang.community.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.community.dto.request.CreatePostRequest;
import com.boindang.community.dto.response.BaseResponse;
import com.boindang.community.dto.response.CreatePostResponse;
import com.boindang.community.dto.response.PostListResponse;
import com.boindang.community.dto.response.PostResponse;
import com.boindang.community.service.PostService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@Tag(name = "게시글", description = "커뮤니티 게시글 관련 API입니다.")
public class PostController {

	private final PostService postService;

	@Operation(summary = "게시글 목록 조회", description = "삭제되지 않은 게시글 전체를 조회합니다.")
	@GetMapping("/read")
	public BaseResponse<PostListResponse> getAllPosts(
		@RequestHeader("X-User-Id") String userId,
		@RequestParam(required = false) String category,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "0") int page

	) {
		return BaseResponse.success(200, "게시글 목록 조회가 완료되었습니다."
			, postService.getAllPosts(Long.parseLong(userId), category, size, page));
	}

	@Operation(summary = "게시글 상세 조회", description = "게시글 ID로 상세 내용을 조회합니다.")
	@GetMapping("/{postId}")
	public BaseResponse<PostResponse> getPost(
		@PathVariable Long postId,
		@RequestHeader("X-User-Id") String userId
	) {
		return BaseResponse.success(200, "게시글 상세조회가 완료되었습니다."
			, postService.getPostById(postId, Long.parseLong(userId)));
	}

	@Operation(summary = "게시글 작성", description = "새 게시글을 작성합니다.")
	@PostMapping("/write")
	public BaseResponse<CreatePostResponse> createPost(
		@RequestHeader("X-User-Id") String userId,
		@RequestBody @Valid CreatePostRequest request
	) {
		Long postId = postService.createPost(Long.parseLong(userId), request);
		return BaseResponse.success(200, "게시글 작성이 완료되었습니다."
			, new CreatePostResponse(postId));
	}

	@Operation(summary = "게시글 삭제", description = "본인의 게시글을 논리적으로 삭제합니다.")
	@DeleteMapping("/{postId}")
	public BaseResponse<Void> deletePost(
		@PathVariable Long postId,
		@RequestHeader("X-User-Id") String userId
	) {
		postService.deletePost(postId, Long.parseLong(userId));
		return BaseResponse.success(200, "게시글 삭제가 완료되었습니다.", null);
	}
}

