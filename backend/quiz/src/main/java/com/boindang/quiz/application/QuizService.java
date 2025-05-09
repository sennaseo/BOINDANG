package com.boindang.quiz.application;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boindang.quiz.common.exception.ErrorCode;
import com.boindang.quiz.common.exception.QuizException;
import com.boindang.quiz.domain.Quiz;
import com.boindang.quiz.domain.QuizOption;
import com.boindang.quiz.domain.QuizSolvedHistory;
import com.boindang.quiz.infrastructure.QuizRepository;
import com.boindang.quiz.infrastructure.QuizSolvedHistoryRepository;
import com.boindang.quiz.presentation.dto.request.AnswerRequest;
import com.boindang.quiz.presentation.dto.response.QuizAnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizService {

	private final QuizRepository quizRepository;
	private final QuizSolvedHistoryRepository historyRepository;

	public List<QuizResponse> generateQuizzes(Long userId) {
		List<Long> solvedQuizIds = historyRepository.findQuizIdsByUserId(userId);

		List<Quiz> quizzes;
		if (solvedQuizIds == null || solvedQuizIds.isEmpty()) {
			quizzes = quizRepository.findFiveRandomQuizzes();
		} else {
			quizzes = quizRepository.findFiveUnsolvedQuizzes(solvedQuizIds);
		}

		// 3. DTO 변환 (셔플 포함)
		return quizzes.stream()
			.map(quiz -> {
				List<String> options = quiz.getOptions().stream()
					.map(QuizOption::getContent)
					.collect(Collectors.toList());
				Collections.shuffle(options);
				return new QuizResponse(
					quiz.getId(),
					quiz.getTitle(),
					quiz.getQuestion(),
					options
				);
			})
			.toList();
	}

	@Transactional
	public QuizAnswerResponse submitAnswer(AnswerRequest request) {
		Quiz quiz = quizRepository.findById(request.quizId())
			.orElseThrow(() -> new QuizException(ErrorCode.QUIZ_NOT_FOUND));

		boolean isCorrect = quiz.isCorrect(request.selectedOption());

		// 선택한 보기의 해설 찾기
		String explanation = quiz.getOptions().stream()
			.filter(opt -> opt.getContent().equalsIgnoreCase(request.selectedOption()))
			.findFirst()
			.map(QuizOption::getExplanation)
			.orElse("해설을 찾을 수 없습니다.");

		// 풀이 이력 저장
		QuizSolvedHistory history = new QuizSolvedHistory(
			request.userId(), quiz, isCorrect
		);
		historyRepository.save(history);

		return new QuizAnswerResponse(isCorrect, explanation);
	}

}
