package com.nutritionservice.nutrition.repository;

import com.nutritionservice.nutrition.model.document.NutritionReport;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NutritionReportRepository extends MongoRepository<NutritionReport, String> {
    List<NutritionReport> findByUserId(String userId);
}