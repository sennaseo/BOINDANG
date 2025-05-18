package com.boindang.community.common;

import java.util.Arrays;

import com.boindang.community.common.exception.NotFoundException;

public enum PostCategory {
	DIET("식단"),
	EXERCISE("운동"),
	QUESTION("고민&질문"),
	TIP("꿀팁"),
	GOAL("목표");

	private final String displayName;

	PostCategory(String displayName) {
		this.displayName = displayName;
	}

	public String getDisplayName() {
		return displayName;
	}

	public static boolean isValid(String name) {
		return Arrays.stream(PostCategory.values())
			.anyMatch(category ->
				category.name().equalsIgnoreCase(name) ||
					category.displayName.equalsIgnoreCase(name)
			);
	}

	public static PostCategory from(String name) {
		return Arrays.stream(PostCategory.values())
			.filter(category ->
				category.name().equalsIgnoreCase(name) ||
					category.displayName.equalsIgnoreCase(name)
			)
			.findFirst()
			.orElseThrow(() -> new NotFoundException("존재하지 않는 카테고리입니다."));
	}
}
