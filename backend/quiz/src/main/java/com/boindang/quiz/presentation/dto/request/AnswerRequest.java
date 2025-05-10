package com.boindang.quiz.presentation.dto.request;

public record AnswerRequest(
	Long quizId,
	Long selectedOptionId
) {}