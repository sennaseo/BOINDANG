package com.boindang.quiz.presentation.dto.response;

import java.util.List;

public record QuizResponse(
	Long quizId,
	String title,
	String question,
	List<String> options
) {}

