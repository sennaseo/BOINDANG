package com.boindang.quiz.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boindang.quiz.domain.QuizSolvedHistory;

public interface QuizSolvedHistoryRepository extends JpaRepository<QuizSolvedHistory, Long> {
	@Query("SELECT h.quiz.id FROM QuizSolvedHistory h WHERE h.userId = :userId")
	List<Long> findQuizIdsByUserId(@Param("userId") Long userId);
	List<QuizSolvedHistory> findByUserIdAndIsCorrectFalse(Long userId);  // 오답노트용
}

