package com.boindang.quiz.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Quiz {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	private String question;

	@Column(name = "answer")
	private Long answerOptionId;

	@OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<QuizOption> options = new ArrayList<>();

	public Quiz(String title, String question, Long answerOptionId) {
		this.title = title;
		this.question = question;
		this.answerOptionId = answerOptionId;
	}

	// 도메인 책임: 정답 판별
	public boolean isCorrect(Long selectedOptionId) {
		return answerOptionId != null && answerOptionId.equals(selectedOptionId);
	}

	// 도메인 책임: 보기 포함 여부 검증
	public boolean hasOption(Long optionId) {
		return options.stream()
			.anyMatch(option -> option.getId().equals(optionId));
	}
}
