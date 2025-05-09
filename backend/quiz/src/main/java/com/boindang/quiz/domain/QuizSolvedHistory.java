package com.boindang.quiz.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

	private LocalDateTime solvedAt;

	public QuizSolvedHistory(Long userId, Quiz quiz, boolean isCorrect) {
		this.userId = userId;
		this.quiz = quiz;
		this.isCorrect = isCorrect;
		this.solvedAt = LocalDateTime.now();
	}
}
