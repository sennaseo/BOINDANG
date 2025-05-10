package com.boindang.quiz.presentation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.quiz.application.QuizService;
import com.boindang.quiz.common.response.BaseResponse;
import com.boindang.quiz.presentation.dto.request.AnswerRequest;
import com.boindang.quiz.presentation.dto.response.QuizAnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizResponse;
import com.boindang.quiz.presentation.dto.response.QuizStatisticsResponse;
import com.boindang.quiz.presentation.dto.response.WrongAnswerResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class QuizController implements QuizApi {

	private final QuizService quizService;

	@Override
	@GetMapping
	public BaseResponse<List<QuizResponse>> getBatchQuiz(@RequestHeader("X-USER-ID") String userId) {
		return BaseResponse.success(200, "퀴즈 5문제 출제가 완료되었습니다."
			, quizService.generateQuizzes(Long.parseLong(userId)));
	}

	@Override
	@PostMapping("/submit")
	public BaseResponse<QuizAnswerResponse> submitAnswer(
		@RequestHeader("X-USER-ID") String userId,
		@RequestBody AnswerRequest request
	) {
		return BaseResponse.success(200, "정답 제출 결과 반환이 완료되었습니다."
			, quizService.submitAnswer(Long.parseLong(userId), request));
	}

	@Override
	@GetMapping("/wrong-answers")
	public BaseResponse<List<WrongAnswerResponse>> getWrongAnswers(@RequestHeader("X-USER-ID") String userId) {
		return BaseResponse.success(200, "오답노트 조회에 성공하였습니다."
			, quizService.getWrongAnswers(Long.parseLong(userId)));
	}

	@Override
	@GetMapping("/statistics")
	public BaseResponse<QuizStatisticsResponse> getStatistics(@RequestHeader("X-USER-ID") String userId) {
		return BaseResponse.success(200, "퀴즈 통계 조회에 성공하였습니다."
			, quizService.getStatistics(Long.parseLong(userId)));
	}

}
