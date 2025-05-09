package com.boindang.quiz.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boindang.quiz.domain.QuizSolvedHistory;

public interface QuizSolvedHistoryRepository extends JpaRepository<QuizSolvedHistory, Long> {
	@Query("SELECT h.quiz.id FROM QuizSolvedHistory h WHERE h.userId = :userId")
	List<Long> findQuizIdsByUserId(@Param("userId") Long userId);

	@Query("""
		SELECT h
		FROM QuizSolvedHistory h
		JOIN FETCH h.quiz q
		JOIN FETCH q.options
		WHERE h.userId = :userId AND h.isCorrect = false
	""")
	List<QuizSolvedHistory> findWrongAnswersByUserId(@Param("userId") Long userId);

}

