package com.boindang.quiz.presentation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import com.boindang.quiz.application.QuizService;
import com.boindang.quiz.common.response.BaseResponse;
import com.boindang.quiz.presentation.dto.QuizResponse;

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
}
