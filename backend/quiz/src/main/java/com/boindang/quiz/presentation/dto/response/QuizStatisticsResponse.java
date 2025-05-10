package com.boindang.quiz.presentation.dto.response;

public record QuizStatisticsResponse(
	int totalSolved,
	int correctCount,
	int wrongCount,
	double accuracy
) {}
