package com.boindang.quiz.presentation.dto.response;

public record QuizAnswerResponse(
	boolean isCorrect,
	String explanation
) {}
