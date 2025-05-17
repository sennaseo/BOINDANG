package com.boindang.quiz.presentation.dto.response;

import java.util.List;

public record AnswerResponse(
	Long quizId,
	String question,
	List<String> options,
	boolean isCorrect,
	int answerId,
	int selectedId,
	String explanation,
	String selectedExplanation
) {}

