package com.boindang.quiz.presentation.dto.request;

public record AnswerRequest(
	Long userId,
	Long quizId,
	String selectedOption
) {}