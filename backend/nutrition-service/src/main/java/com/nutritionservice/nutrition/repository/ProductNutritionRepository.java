package com.nutritionservice.nutrition.repository;

import com.nutritionservice.nutrition.model.document.ProductNutrition;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductNutritionRepository extends MongoRepository<ProductNutrition, String> {
}