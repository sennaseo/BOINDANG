package com.boindang.quiz.infrastructure;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boindang.quiz.domain.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
	@Query(value = "SELECT * FROM quiz ORDER BY RAND() LIMIT 5", nativeQuery = true)
	List<Quiz> findFiveRandomQuizzes();

	@Query(value = """
    SELECT * FROM quiz
    WHERE id NOT IN (:solvedIds)
    ORDER BY RAND()
    LIMIT 5
    """, nativeQuery = true)
	List<Quiz> findFiveUnsolvedQuizzes(@Param("solvedIds") List<Long> solvedIds);

}
