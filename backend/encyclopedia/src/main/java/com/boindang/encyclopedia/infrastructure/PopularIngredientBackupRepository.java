package com.boindang.encyclopedia.infrastructure;

import com.boindang.encyclopedia.domain.PopularIngredientBackup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PopularIngredientBackupRepository extends JpaRepository<PopularIngredientBackup, Long> {
}
