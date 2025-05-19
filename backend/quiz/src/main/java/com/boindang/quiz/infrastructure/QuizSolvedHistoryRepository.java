package com.boindang.quiz.infrastructure;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boindang.quiz.domain.QuizSolvedHistory;

public interface QuizSolvedHistoryRepository extends JpaRepository<QuizSolvedHistory, Long> {
	@Query("SELECT h.quiz.id FROM QuizSolvedHistory h WHERE h.userId = :userId")
	List<Long> findQuizIdsByUserId(@Param("userId") Long userId);

	int countByUserId(Long userId);

	int countByUserIdAndIsCorrectTrue(Long userId);

	List<QuizSolvedHistory> findAllByUserId(Long userId);

	Optional<QuizSolvedHistory> findByUserIdAndQuizId(Long userId, Long quizId);

}

