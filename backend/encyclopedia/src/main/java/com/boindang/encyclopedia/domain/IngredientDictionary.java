package com.boindang.encyclopedia.domain;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.List;

@Document(indexName = "ingredients")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientDictionary {

    @Id
    private String id;

    private String name; // 성분명(국문)
    private String engName; // 성분명(영문)
    private String category; // 감미료
    private String type; // 당알코올 감미료
    private RiskLevel riskLevel; // 주의

    private int gi; // 혈당 지수
    private float calories; // 칼로리
    private float sweetness; // 상대 감미도

    private String description; // 상세 정보
    private List<String> examples; // 주요 함유 식품
    private List<String> references; // 참고 문헌

    private String bloodResponse; // 혈당 영향
    private String digestEffect; // 소화기계 영향
    private String toothEffect; // 충치 영향
    private List<String> pros; // 장점
    private List<String> cons; // 단점

    private List<String> diabetic; // 당뇨 환자
    private List<String> kidneyPatient; // 신장 질환자
    private List<String> dieter; // 다이어터
    private List<String> muscleBuilder; // 운동인

    private String recommendedDailyIntake; // 일일 권장섭취량
    private String regulatory; // 규제 현황
    private String issue; // 관련 이슈
    private List<String> labels;
    private CompareTable compareTable; // 유사 성분 비교 표

    @Getter
    @AllArgsConstructor
    public enum RiskLevel {
        SAFE("안심"),
        CAUTION("주의"),
        DANGER("위험");

        @JsonValue
        private final String label;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompareTable {
        private List<Row> rows;

        @Getter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class Row {
            private String name;
            private List<String> values;
        }
    }
}