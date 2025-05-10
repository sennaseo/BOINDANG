package com.nutritionservice.nutrition.model.document;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nutrient {
    private Double gram;      // 단백질, 지방, 탄수화물 등 g 단위
    private Double mg;        // 나트륨, 콜레스테롤 등 mg 단위
    private Double ratio;     // 원본 데이터에서 제공된 비율 (필요시 사용)
    private FatDetail sub;    // 지방 하위 항목 (saturatedFat, etc)
}
