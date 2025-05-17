package com.boindang.quiz.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.boindang.quiz.common.exception.QuizException;
import com.boindang.quiz.common.exception.QuizNotFoundException;
import com.boindang.quiz.domain.Quiz;
import com.boindang.quiz.domain.QuizOption;
import com.boindang.quiz.domain.QuizSolvedHistory;
import com.boindang.quiz.infrastructure.QuizRepository;
import com.boindang.quiz.infrastructure.QuizSolvedHistoryRepository;
import com.boindang.quiz.presentation.dto.request.AnswerRequest;
import com.boindang.quiz.presentation.dto.response.AnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizAnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizResponse;
import com.boindang.quiz.presentation.dto.response.QuizStatisticsResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizService {

	private final QuizRepository quizRepository;
	private final QuizSolvedHistoryRepository historyRepository;

	public List<QuizResponse> generateQuizzes(Long userId) {
		List<Long> solvedQuizIds = historyRepository.findQuizIdsByUserId(userId);

		List<Long> quizIndex;
		List<Quiz> quizzes;

		// 안 푼 문제 ID 가져오기
		List<Long> unsolvedQuizIds = CollectionUtils.isEmpty(solvedQuizIds)
			? quizRepository.findRandomQuizIds()
			: quizRepository.findUnsolvedRandomQuizIds(solvedQuizIds);

		int remainingCount = 5 - unsolvedQuizIds.size();

		// 퀴즈 ID 최종 구성
		if (remainingCount <= 0) {
			quizIndex = unsolvedQuizIds.subList(0, 5); // 5개만
		} else {
			// 푼 문제 중에서 랜덤으로 남은 개수만큼 가져오기
			List<Long> supplement = quizRepository.findRandomSolvedQuizIds(solvedQuizIds, remainingCount);
			quizIndex = new ArrayList<>(unsolvedQuizIds);
			quizIndex.addAll(supplement);
		}

		// 퀴즈 조회 + 옵션 포함
		quizzes = quizRepository.findAllByIdWithOptions(quizIndex);

		// DTO 변환 (셔플 포함)
		return quizzes.stream()
			.map(quiz -> {
				List<String> options = quiz.getOptions().stream()
					.map(QuizOption::getContent)
					.collect(Collectors.toList());
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
			.orElseThrow(() -> new QuizNotFoundException("해당 퀴즈를 찾을 수 없습니다."));

		// 2. 보기 ID 유효성 검증
		if (!quiz.hasOption(request.selectedOptionId())) {
			throw new QuizException("선택한 보기는 해당 퀴즈에 속하지 않습니다.");
		}

		// 3. 선택한 보기
		QuizOption selectedOption = quiz.getOptions().stream()
			.filter(option -> option.getOptionId() == request.selectedOptionId())
			.findFirst()
			.orElseThrow(() -> new QuizException("퀴즈 보기 정보가 유효하지 않습니다."));

		// 4. 정답 판별
		boolean isCorrect = quiz.isCorrect(selectedOption.getOptionId());

		// 5. 기존 풀이 기록 확인 (있으면 업데이트, 없으면 저장)
		Optional<QuizSolvedHistory> existing = historyRepository.findByUserIdAndQuizId(userId, quiz.getId());

		if (existing.isPresent()) {
			existing.get().update(isCorrect, request.selectedOptionId());
		} else {
			QuizSolvedHistory history = new QuizSolvedHistory(
				userId,
				quiz,
				isCorrect,
				request.selectedOptionId()
			);
			historyRepository.save(history);
		}

		// 6. 응답 반환
		return new QuizAnswerResponse(
			isCorrect,
			quiz.getAnswerOptionId(),
			selectedOption.getExplanation()
		);
	}

	@Transactional(readOnly = true)
	public List<AnswerResponse> getAnswerHistories(Long userId) {
		List<QuizSolvedHistory> histories = historyRepository.findAllByUserId(userId);

		return histories.stream().map(history -> {
			Quiz quiz = history.getQuiz();
			int selectedId = history.getSelectedOptionId();
			int answerId = quiz.getAnswerOptionId();

			String explanation = quiz.getOptions().stream()
				.filter(opt -> opt.getOptionId() == answerId)
				.map(QuizOption::getExplanation)
				.findFirst()
				.orElse("정답 해설이 없습니다.");

			String selectedExplanation = quiz.getOptions().stream()
				.filter(opt -> opt.getOptionId() == selectedId)
				.map(QuizOption::getExplanation)
				.findFirst()
				.orElse("선택한 보기 해설이 없습니다.");

			return new AnswerResponse(
				quiz.getId(),
				quiz.getQuestion(),
				quiz.getOptions().stream().map(QuizOption::getContent).toList(),
				history.isCorrect(),  // ✅ 맞았는지 여부
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
