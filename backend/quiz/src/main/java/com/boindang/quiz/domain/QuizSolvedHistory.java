package com.boindang.quiz.domain;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizSolvedHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long userId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "quiz_id")
	private Quiz quiz;

	private boolean isCorrect;

	private int selectedOptionId;

	private LocalDateTime solvedAt;

	public QuizSolvedHistory(Long userId, Quiz quiz, boolean isCorrect, int selectedOptionId) {
		this.userId = userId;
		this.quiz = quiz;
		this.isCorrect = isCorrect;
		this.selectedOptionId = selectedOptionId;
		this.solvedAt = LocalDateTime.now();
	}
}
