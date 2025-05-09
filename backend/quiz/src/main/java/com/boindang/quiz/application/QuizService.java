package com.boindang.quiz.application;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.boindang.quiz.domain.Quiz;
import com.boindang.quiz.domain.QuizOption;
import com.boindang.quiz.infrastructure.QuizRepository;
import com.boindang.quiz.infrastructure.QuizSolvedHistoryRepository;
import com.boindang.quiz.presentation.dto.QuizResponse;

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
}
