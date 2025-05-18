package com.boindang.quiz.presentation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.quiz.application.QuizService;
import com.boindang.quiz.common.exception.UserException;
import com.boindang.quiz.common.response.ApiResponses;
import com.boindang.quiz.presentation.dto.request.AnswerRequest;
import com.boindang.quiz.presentation.dto.response.AnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizAnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizResponse;
import com.boindang.quiz.presentation.dto.response.QuizStatisticsResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class QuizController implements QuizApi {

	private final QuizService quizService;

	@Override
	@GetMapping
	public ApiResponses<List<QuizResponse>> getBatchQuiz(@RequestHeader("X-User-Id") String userId) {
		if (userId == null || userId.trim().isEmpty()) {
			throw new UserException("유효하지 않은 사용자입니다.");
		}

		return ApiResponses.success(quizService.generateQuizzes(Long.parseLong(userId)));
	}

	@Override
	@PostMapping("/submit")
	public ApiResponses<QuizAnswerResponse> submitAnswer(
		@RequestHeader("X-User-Id") String userId,
		@RequestBody AnswerRequest request
	) {
		if (userId == null || userId.trim().isEmpty()) {
			throw new UserException("유효하지 않은 사용자입니다.");
		}

		return ApiResponses.success(quizService.submitAnswer(Long.parseLong(userId), request));
	}

	@Override
	@GetMapping("/wrong-answers")
	public ApiResponses<List<AnswerResponse>> getWrongAnswers(@RequestHeader("X-User-Id") String userId) {
		if (userId == null || userId.trim().isEmpty()) {
			throw new UserException("유효하지 않은 사용자입니다.");
		}

		return ApiResponses.success(quizService.getAnswerHistories(Long.parseLong(userId)));
	}

	@Override
	@GetMapping("/statistics")
	public ApiResponses<QuizStatisticsResponse> getStatistics(@RequestHeader("X-User-Id") String userId) {
		if (userId == null || userId.trim().isEmpty()) {
			throw new UserException("유효하지 않은 사용자입니다.");
		}

		return ApiResponses.success(quizService.getStatistics(Long.parseLong(userId)));
	}

}
