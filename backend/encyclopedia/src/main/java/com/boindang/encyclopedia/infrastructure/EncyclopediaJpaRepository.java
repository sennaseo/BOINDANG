package com.boindang.encyclopedia.infrastructure;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boindang.encyclopedia.domain.Encyclopedia;
import com.boindang.encyclopedia.domain.Ingredient;
@Repository
public interface EncyclopediaJpaRepository extends JpaRepository<Encyclopedia, Long> {
	List<Encyclopedia> findByNameContaining(String query);
}

