package com.boindang.quiz.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode
public class QuizOption {

	@Column(nullable = false)
	private String content;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String explanation;

	public QuizOption(String content, String explanation) {
		this.content = content;
		this.explanation = explanation;
	}

	public boolean isSameAs(String userInput) {
		return this.content.equalsIgnoreCase(userInput);
	}

}

