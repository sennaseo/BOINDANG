package com.boindang.encyclopedia.infrastructure;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boindang.encyclopedia.domain.Encyclopedia;

@Repository
public interface EncyclopediaJpaRepository extends JpaRepository<Encyclopedia, Long> {
	List<Encyclopedia> findByNameContaining(String query);
}

