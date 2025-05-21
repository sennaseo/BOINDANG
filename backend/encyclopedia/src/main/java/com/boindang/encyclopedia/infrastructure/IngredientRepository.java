package com.boindang.encyclopedia.infrastructure;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.boindang.encyclopedia.domain.Ingredient;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, String> {
	Optional<Ingredient> findByName(String name);
	List<Ingredient> findByNameStartingWith(String prefix);
}

