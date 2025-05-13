package com.nutritionservice.nutrition.util;

import java.util.*;

public class NutrientGradeRule {

    public enum UserType {
        다이어트, 근성장, 당뇨병, 신장질환, ALL
    }

    private static final Map<String, Map<UserType, List<GradeRange>>> rules = new HashMap<>();

    static {
        // 단백질 ✅
        rules.put("protein", Map.of(
                UserType.다이어트, List.of(
                        new GradeRange(0, 10, "결핍"),
                        new GradeRange(10, 15, "권장"),
                        new GradeRange(15, 25, "권장"),
                        new GradeRange(25, 30, "주의"),
                        new GradeRange(30, 1000, "위험")
                ),
                UserType.근성장, List.of(
                        new GradeRange(0, 15, "결핍"),
                        new GradeRange(15, 30, "권장"),
                        new GradeRange(30, 1000, "위험")
                ),
                UserType.당뇨병, List.of(
                        new GradeRange(0, 10, "결핍"),
                        new GradeRange(10, 25, "권장"),
                        new GradeRange(25, 30, "주의"),
                        new GradeRange(30, 1000, "위험")
                ),
                UserType.신장질환, List.of(
                        new GradeRange(0, 15, "권장"),
                        new GradeRange(15, 25, "주의"),
                        new GradeRange(25, 1000, "위험")
                )
        ));

        // 탄수화물 ✅
        rules.put("carbohydrate", Map.of(
                UserType.다이어트, List.of(
                        new GradeRange(0, 25, "권장"),
                        new GradeRange(25, 30, "주의"),
                        new GradeRange(30, 1000, "위험")
                ),
                UserType.근성장, List.of(
                        new GradeRange(0, 15, "결핍"),
                        new GradeRange(15, 30, "권장"),
                        new GradeRange(30, 1000, "위험")
                ),
                UserType.당뇨병, List.of(
                        new GradeRange(0, 60, "권장"),
                        new GradeRange(60, 65, "주의"),
                        new GradeRange(65, 1000, "위험")
                ),
                UserType.신장질환, List.of(
                        new GradeRange(0, 60, "권장"),
                        new GradeRange(60, 65, "주의"),
                        new GradeRange(65, 1000, "위험")
                )
        ));

        // 당류 ✅
        rules.put("sugar", Map.of(
                UserType.다이어트, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "주의"),
                        new GradeRange(15, 1000, "위험")
                ),
                UserType.근성장, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "주의"),
                        new GradeRange(15, 1000, "위험")
                ),
                UserType.당뇨병, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 10, "주의"),
                        new GradeRange(10, 15, "위험"),
                        new GradeRange(15, 1000, "위험")
                ),
                UserType.신장질환, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "주의"),
                        new GradeRange(15, 1000, "위험")
                )
        ));


        // 지방 ✅
        rules.put("fat", Map.of(
                UserType.다이어트, List.of(
                        new GradeRange(0, 30, "권장"),
                        new GradeRange(30, 35, "주의"),
                        new GradeRange(35, 1000, "위험")
                ),
                UserType.근성장, List.of(
                        new GradeRange(0, 30, "권장"),
                        new GradeRange(30, 35, "주의"),
                        new GradeRange(35, 1000, "위험")
                ),
                UserType.당뇨병, List.of(
                        new GradeRange(0, 30, "권장"),
                        new GradeRange(30, 35, "주의"),
                        new GradeRange(35, 1000, "위험")
                ),
                UserType.신장질환, List.of(
                        new GradeRange(0, 30, "권장"),
                        new GradeRange(30, 35, "주의"),
                        new GradeRange(35, 1000, "위험")
                )
        ));

        // 포화지방 ✅ (공통 기준)
        rules.put("saturatedFat", Map.of(
                UserType.ALL, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 7, "권장"),
                        new GradeRange(7, 10, "주의"),
                        new GradeRange(10, 1000, "위험")
                )
        ));


        // 트랜스지방 ✅ (공통 기준)
        rules.put("transFat", Map.of(
                UserType.ALL, List.of(
                        new GradeRange(0, 0.5, "권장"),
                        new GradeRange(0.5, 1.0, "주의"),
                        new GradeRange(1.0, 1000, "위험")
                )
        ));


        // 나트륨 ✅
        rules.put("sodium", Map.of(
                UserType.다이어트, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "주의"),
                        new GradeRange(15, 1000, "위험")
                ),
                UserType.근성장, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "주의"),
                        new GradeRange(15, 1000, "위험")
                ),
                UserType.당뇨병, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 10, "주의"),
                        new GradeRange(10, 15, "위험"),
                        new GradeRange(15, 1000, "위험")
                ),
                UserType.신장질환, List.of(
                        new GradeRange(0, 5, "권장"),
                        new GradeRange(5, 10, "주의"),
                        new GradeRange(10, 15, "위험"),
                        new GradeRange(15, 1000, "위험")
                )
        ));


        // 칼륨 ✅
        rules.put("potassium", Map.of(
                UserType.다이어트, List.of(
                        new GradeRange(0, 5, "결핍"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "권장"),
                        new GradeRange(15, 20, "주의"),
                        new GradeRange(20, 1000, "주의")
                ),
                UserType.근성장, List.of(
                        new GradeRange(0, 5, "결핍"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "권장"),
                        new GradeRange(15, 20, "주의"),
                        new GradeRange(20, 1000, "주의")
                ),
                UserType.당뇨병, List.of(
                        new GradeRange(0, 5, "결핍"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "권장"),
                        new GradeRange(15, 20, "주의"),
                        new GradeRange(20, 1000, "주의")
                ),
                UserType.신장질환, List.of(
                        new GradeRange(0, 5, "위험"),
                        new GradeRange(5, 10, "주의"),
                        new GradeRange(10, 15, "주의"),
                        new GradeRange(15, 20, "위험"),
                        new GradeRange(20, 1000, "위험")
                )
        ));


        // 인 ✅
        rules.put("phosphorus", Map.of(
                UserType.다이어트, List.of(
                        new GradeRange(0, 5, "결핍"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "권장"),
                        new GradeRange(15, 1000, "주의")
                ),
                UserType.근성장, List.of(
                        new GradeRange(0, 5, "결핍"),
                        new GradeRange(5, 10, "결핍"),
                        new GradeRange(10, 15, "권장"),
                        new GradeRange(15, 1000, "주의")
                ),
                UserType.당뇨병, List.of(
                        new GradeRange(0, 5, "결핍"),
                        new GradeRange(5, 10, "권장"),
                        new GradeRange(10, 15, "권장"),
                        new GradeRange(15, 1000, "주의")
                ),
                UserType.신장질환, List.of(
                        new GradeRange(0, 5, "위험"),
                        new GradeRange(5, 10, "주의"),
                        new GradeRange(10, 15, "주의"),
                        new GradeRange(15, 1000, "위험")
                )
        ));


        // 식이섬유 ✅
        rules.put("fiber", Map.of(
                UserType.다이어트, List.of(
                        new GradeRange(0, 10, "결핍"),
                        new GradeRange(10, 20, "권장"),
                        new GradeRange(20, 30, "권장"),
                        new GradeRange(30, 1000, "주의")
                ),
                UserType.근성장, List.of(
                        new GradeRange(0, 10, "결핍"),
                        new GradeRange(10, 20, "결핍"),
                        new GradeRange(20, 30, "권장"),
                        new GradeRange(30, 1000, "주의")
                ),
                UserType.당뇨병, List.of(
                        new GradeRange(0, 10, "결핍"),
                        new GradeRange(10, 20, "권장"),
                        new GradeRange(20, 30, "권장"),
                        new GradeRange(30, 1000, "주의")
                ),
                UserType.신장질환, List.of(
                        new GradeRange(0, 10, "결핍"),
                        new GradeRange(10, 20, "권장"),
                        new GradeRange(20, 30, "주의"),
                        new GradeRange(30, 1000, "주의")
                )
        ));


        // 콜레스테롤 ✅ (공통 기준)
        rules.put("cholesterol", Map.of(
                UserType.ALL, List.of(
                        new GradeRange(0, 10, "권장"),
                        new GradeRange(10, 20, "주의"),
                        new GradeRange(20, 1000, "위험")
                )
        ));

    }

    public static String getGrade(String nutrient, UserType userType, double percent) {
        Map<UserType, List<GradeRange>> nutrientRules = rules.get(nutrient);
        if (nutrientRules == null) return "정보없음";

        List<GradeRange> ranges = nutrientRules.getOrDefault(userType, nutrientRules.get(UserType.ALL));
        if (ranges == null) return "정보없음";

        for (GradeRange range : ranges) {
            if (range.includes(percent)) return range.grade;
        }
        return "정보없음";
    }


    private record GradeRange(double min, double max, String grade) {
        boolean includes(double percent) {
            return percent >= min && percent < max;
        }
    }
}
