package com.nutritionservice.nutrition.repository;

import com.nutritionservice.nutrition.model.document.NutritionReport;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NutritionReportRepository extends MongoRepository<NutritionReport, String> {
    List<NutritionReport> findByUserId(String userId);
    List<NutritionReport> findByUserIdOrderByAnalyzedAtDesc(String userId);
    Optional<NutritionReport> findByUserIdAndProductId(String userId, String productId);
}