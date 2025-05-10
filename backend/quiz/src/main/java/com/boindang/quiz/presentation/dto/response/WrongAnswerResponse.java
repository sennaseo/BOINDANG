package com.boindang.quiz.presentation.dto.response;

import java.util.List;

public record WrongAnswerResponse(
	Long quizId,
	String question,
	List<String> options,
	Long answerId,
	Long selectedId,
	String explanation,
	String selectedExplanation
) {}

