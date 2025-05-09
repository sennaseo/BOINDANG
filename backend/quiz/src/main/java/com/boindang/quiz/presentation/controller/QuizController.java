package com.boindang.quiz.presentation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;
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
public class QuizController implements QuizApi {

	private final QuizService quizService;

	@Override
	public BaseResponse<List<QuizResponse>> getBatchQuiz(Long userId) {
		return BaseResponse.success(200, "퀴즈 5문제 출제가 완료되었습니다."
			, quizService.generateQuizzes(userId));
	}

	@Override
	public BaseResponse<QuizAnswerResponse> submitAnswer(@RequestBody AnswerRequest request) {
		return BaseResponse.success(200, "정답 제출 결과 반환이 완료되었습니다."
			, quizService.submitAnswer(request));
	}

	@Override
	public BaseResponse<List<WrongAnswerResponse>> getWrongAnswers(Long userId) {
		return BaseResponse.success(200, "오답노트 조회에 성공하였습니다."
			, quizService.getWrongAnswers(userId));
	}

	@Override
	public BaseResponse<QuizStatisticsResponse> getStatistics(Long userId) {
		return BaseResponse.success(200, "퀴즈 통계 조회에 성공하였습니다."
			, quizService.getStatistics(userId));
	}

}
