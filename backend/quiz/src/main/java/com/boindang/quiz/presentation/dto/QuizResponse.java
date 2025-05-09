package com.boindang.quiz.presentation.dto;

import java.util.List;

public record QuizResponse(
	Long quizId,
	String title,
	String question,
	List<String> options
) {}

