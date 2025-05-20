package com.nutritionservice.nutrition.util;

import java.util.Map;

public class UserTypeConverter {

    private static final Map<String, String> KOR_TO_ENG = Map.of(
            "당뇨병", "diabetic",
            "신장질환", "kidneyPatient",
            "다이어트", "dieter",
            "근성장", "muscleBuilder"
    );

    public static String toEnglish(String korean) {
        return KOR_TO_ENG.getOrDefault(korean, "unknown");
    }

    private static final Map<String, String> ENG_TO_KOR = Map.of(
            "diabetic", "당뇨병",
            "kidneyPatient", "신장질환",
            "dieter", "다이어트",
            "muscleBuilder", "근성장"
    );

    public static String toKorean(String english) {
        return ENG_TO_KOR.getOrDefault(english, "알 수 없음");
    }
}
