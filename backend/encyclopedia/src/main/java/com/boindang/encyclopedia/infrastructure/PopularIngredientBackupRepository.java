package com.boindang.encyclopedia.infrastructure;

import java.time.LocalDate;
import java.util.List;

import com.boindang.encyclopedia.domain.PopularIngredientBackup;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PopularIngredientBackupRepository extends JpaRepository<PopularIngredientBackup, Long> {

	@Query("SELECT p FROM PopularIngredientBackup p WHERE p.backupDate = :date ORDER BY p.score DESC")
	List<PopularIngredientBackup> findTopNByBackupDate(@Param("date") LocalDate date, Pageable pageable);

	default List<PopularIngredientBackup> findTopNByBackupDate(LocalDate date, int limit) {
		return findTopNByBackupDate(date, PageRequest.of(0, limit));
	}
}
