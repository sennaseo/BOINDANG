package com.boindang.quiz.infrastructure;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.boindang.quiz.domain.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
	@Query(value = "SELECT id FROM quiz ORDER BY RAND() LIMIT 5", nativeQuery = true)
	List<Long> findRandomQuizIds();

	@Query("SELECT q FROM Quiz q JOIN FETCH q.options WHERE q.id IN :ids")
	List<Quiz> findAllByIdWithOptions(@Param("ids") List<Long> ids);

	@Query(value = """
    SELECT id FROM quiz
    WHERE id NOT IN (:solvedIds)
    ORDER BY RAND()
    LIMIT 5
    """, nativeQuery = true)
	List<Long> findUnsolvedRandomQuizIds(@Param("solvedIds") List<Long> solvedIds);


}
