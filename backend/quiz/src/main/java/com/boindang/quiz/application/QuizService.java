package com.boindang.quiz.application;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

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
import com.boindang.quiz.presentation.dto.response.WrongAnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizStatisticsResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizService {

	private final QuizRepository quizRepository;
	private final QuizSolvedHistoryRepository historyRepository;

	public List<QuizResponse> generateQuizzes(Long userId) {
		List<Long> solvedQuizIds = historyRepository.findQuizIdsByUserId(userId);

		List<Quiz> quizzes;
		List<Long> quiz_index;
		if (CollectionUtils.isEmpty(solvedQuizIds)) {
			quiz_index = quizRepository.findRandomQuizIds();
			quizzes = quizRepository.findAllByIdWithOptions(quiz_index);
		} else {
			quiz_index = quizRepository.findUnsolvedRandomQuizIds(solvedQuizIds);
			quizzes = quizRepository.findAllByIdWithOptions(quiz_index);
		}

		// DTO 변환 (셔플 포함)
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
	public QuizAnswerResponse submitAnswer(Long userId, AnswerRequest request) {
		// 1. 퀴즈 조회
		Quiz quiz = quizRepository.findById(request.quizId())
			.orElseThrow(() -> new QuizException(ErrorCode.QUIZ_NOT_FOUND));

		// 2. 보기 ID 유효성 검증 (도메인 책임)
		if (!quiz.hasOption(request.selectedOptionId())) {
			throw new QuizException(ErrorCode.OPTION_QUIZ_MISMATCH);
		}

		// 3. 선택한 보기 엔티티 조회
		QuizOption selectedOption = quiz.getOptions().stream()
			.filter(option -> option.getOptionId() == request.selectedOptionId()) // ✅ int == int
			.findFirst()
			.orElseThrow(() -> new QuizException(ErrorCode.INVALID_QUIZ_OPTION)); // 방어적 처리

		// 4. 정답 판별 (도메인 책임)
		boolean isCorrect = quiz.isCorrect(selectedOption.getOptionId());

		// 5. 풀이 이력 저장
		QuizSolvedHistory history = new QuizSolvedHistory(
			userId,
			quiz,
			isCorrect,
			request.selectedOptionId()
		);
		historyRepository.save(history);

		// 6. 응답 반환
		return new QuizAnswerResponse(
			isCorrect,
			selectedOption.getExplanation()
		);
	}

	public List<WrongAnswerResponse> getWrongAnswers(Long userId) {
		List<QuizSolvedHistory> histories = historyRepository.findWrongAnswersByUserId(userId);

		return histories.stream().map(history -> {
			Quiz quiz = history.getQuiz();
			int selectedId = history.getSelectedOptionId();
			int answerId = quiz.getAnswerOptionId();

			System.out.println("🧪 Quiz ID: " + quiz.getId());
			System.out.println("🧪 Answer ID: " + answerId);
			System.out.println("🧪 Selected ID: " + selectedId);
			System.out.println("🧪 Options:");

			quiz.getOptions().forEach(opt -> {
				System.out.println(" - Option ID: " + opt.getOptionId());
				System.out.println("   Content: " + opt.getContent());
				System.out.println("   Explanation: " + opt.getExplanation());
			});

			String explanation = quiz.getOptions().stream()
				.filter(opt -> opt.getOptionId() == answerId)
				.map(QuizOption::getExplanation)
				.findFirst()
				.orElse("정답 해설이 없습니다.");

			String selectedExplanation = quiz.getOptions().stream()
				.filter(opt -> opt.getOptionId() == selectedId)
				.map(QuizOption::getExplanation)
				.findFirst()
				.orElse("오답 해설이 없습니다.");

			return new WrongAnswerResponse(
				quiz.getId(),
				quiz.getQuestion(),
				quiz.getOptions().stream().map(QuizOption::getContent).toList(),
				answerId,
				selectedId,
				explanation,
				selectedExplanation
			);
		}).toList();
	}

	public QuizStatisticsResponse getStatistics(Long userId) {
		int total = historyRepository.countByUserId(userId);
		int correct = historyRepository.countByUserIdAndIsCorrectTrue(userId);
		int wrong = total - correct;
		double accuracy = (total == 0) ? 0.0 : Math.round(((double) correct / total) * 1000) / 10.0;

		return new QuizStatisticsResponse(total, correct, wrong, accuracy);
	}

}
