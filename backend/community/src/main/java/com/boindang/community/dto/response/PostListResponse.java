package com.boindang.community.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostListResponse {
	private int totalPage;
	private List<PostResponse> posts;
}
