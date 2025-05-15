package com.nutritionservice.nutrition.service;

import com.nutritionservice.nutrition.model.document.Nutrition;
import com.nutritionservice.nutrition.model.document.ProductNutrition;
import com.nutritionservice.nutrition.model.dto.analysis.NutrientResult;
import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import com.nutritionservice.nutrition.util.NutrientGradeRule;
import com.nutritionservice.nutrition.util.NutrientGradeRule.UserType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class AnalysisHelper {
    private static final Logger logger = LoggerFactory.getLogger(NutritionService.class);

    public static Map<String, NutrientResult> calculateRatios(ProductNutrition product, UserInfo user) {
        logger.debug("변수 초기화 시작");
        Nutrition ns = product.getResult().getNutritionAnalysis().getNutrition();
        UserType userType = UserType.valueOf(user.getUserType());

        Map<String, NutrientResult> result = new HashMap<>();

        logger.debug("변수 초기화 완료\nns: " + ns.toString() + "\nuserType: " + userType + "------------------");

        result.put("단백질", makeResult("protein", ns.getProtein().getGram(), ns.getProtein().getRatio(), userType));
        result.put("지방", makeResult("fat", ns.getFat().getGram(), ns.getFat().getRatio(), userType));
        result.put("탄수화물", makeResult("carbohydrate", ns.getCarbohydrate().getGram(), ns.getCarbohydrate().getRatio(), userType));

        logger.debug("탄단지 삽입 완료\nresult: "+result.get("탄수화물")+result.get("단백질")+result.get("지방"));

        if (ns.getSodium() != null) {
            double sodiumGram = ns.getSodium().getMg() != null
                    ? ns.getSodium().getMg() / 1000.0
                    : ns.getSodium().getGram();
            double sodiumRatio = ns.getSodium().getRatio();
            result.put("나트륨", makeResult("sodium", sodiumGram, sodiumRatio, userType));
        }
        logger.debug("나트륨");
        if (ns.getCholesterol() != null && ns.getCholesterol().getMg() != null) {
            double cholesterolGram = ns.getCholesterol().getMg() / 1000.0;
            double cholesterolRatio = ns.getCholesterol().getRatio();
            result.put("콜레스테롤", makeResult("cholesterol", cholesterolGram, cholesterolRatio, userType));
        }
        logger.debug("콜레스테롤");

        if (ns.getFat() != null && ns.getFat().getSub() != null) {
            if (ns.getFat().getSub().getSaturatedFat() != null) {
                result.put("포화지방", makeResult(
                        "saturatedFat",
                        ns.getFat().getSub().getSaturatedFat().getGram(),
                        ns.getFat().getSub().getSaturatedFat().getRatio(),
                        userType
                ));
            }
            if (ns.getFat().getSub().getTransFat() != null) {
                result.put("트랜스지방", makeResult(
                        "transFat",
                        ns.getFat().getSub().getTransFat().getGram(),
                        ns.getFat().getSub().getTransFat().getRatio(),
                        userType
                ));
            }
        }
        logger.debug("지방");


        System.out.println("✅ 계산된 영양 비율 결과:");
        for (Map.Entry<String, NutrientResult> entry : result.entrySet()) {
            System.out.printf("- %s: %.1fg / %.1f%% → 등급: %s\n",
                    entry.getKey(),
                    entry.getValue().getValue(),
                    entry.getValue().getPercent(),
                    entry.getValue().getGrade());
        }

        return result;
    }

    private static NutrientResult makeResult(String key, double actual, double percent, UserType userType) {
        String grade = NutrientGradeRule.getGrade(key, userType, percent);

        return NutrientResult.builder()
                .value(actual)
                .percent(Math.round(percent * 10) / 10.0)
                .grade(grade)
                .build();
    }

}
