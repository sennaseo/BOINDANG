package com.boindang.quiz.presentation.dto.response;

import java.util.List;

public record WrongAnswerResponse(
	Long quizId,
	String question,
	List<String> options,
	int answerId,
	int selectedId,
	String explanation,
	String selectedExplanation
) {}

