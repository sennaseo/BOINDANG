package com.boindang.encyclopedia.application;

import com.boindang.encyclopedia.application.mapper.EncyclopediaMapper;
import com.boindang.encyclopedia.common.exception.ErrorCode;
import com.boindang.encyclopedia.common.exception.IngredientException;
import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.infrastructure.EncyclopediaRepository;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.EncyclopediaSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EncyclopediaService {

    private final EncyclopediaRepository encyclopediaRepository;
    private final PopularIngredientService popularIngredientService;

    public void saveIngredientData() {
        IngredientDictionary ingredient = IngredientDictionary.builder()
                .id("maltitol")
                .name("말티톨")
                .engName("Maltitol")
                .category("감미료")
                .type("당알코올 감미료")
                .riskLevel(IngredientDictionary.RiskLevel.CAUTION)
                .gi(35)
                .calories(2.1f)
                .sweetness(0.9f)
                .description("말티톨은 자연에서 발견되는 당알코올의 일종으로, 주로 설탕을 대체하는 감미료로 사용됩니다. 설탕과 유사한 맛과 질감을 가지고 있어 무설탕 또는 저설탕 제품에 널리 사용됩니다. 말티톨은 설탕보다 칼로리가 낮고 혈당 지수가 낮아 당뇨병 환자나 체중 관리가 필요한 사람들에게 대안으로 제시되기도 합니다.")
                .examples(List.of("무설탕 초콜릿 및 사탕", "저당 아이스크림", "당뇨병 환자용 특수 식품", "무설탕 껌 및 민트", "단백질 바 및 영양 보충제"))
                .references(List.of("European Food Safety Authority. Scientific Opinion on the substantiation of health claims related to the sugar replacers. EFSA Journal, 2011.", "Livesey G. Health potential of polyols as sugar replacers, with emphasis on low glycaemic properties. Nutrition Research Reviews, 2003.", "Kearsley MW, Deis RC. Maltitol Powder. In: Sweeteners and Sugar Alternatives in Food Technology, 2012."))
                .bloodResponse("말티톨은 설탕보다 혈당 지수(GI)가 낮지만, 다른 당알코올에 비해 상대적으로 높은 편입니다. 혈당 조절이 중요한 당뇨병 환자는 섭취량에 주의해야 합니다.")
                .digestEffect("소화 과정에서 완전히 흡수되지 않아 과다 섭취 시 복부 팽만감, 가스, 설사 등 소화기계 불편함을 유발할 수 있습니다. 일반적으로 20-30g 이상 섭취 시 이러한 부작용이 나타날 수 있습니다.")
                .toothEffect("충치를 유발하는 박테리아가 말티톨을 발효시키지 못해 충치 예방에 도움이 됩니다.")
                .pros(List.of("설탕과 유사한 맛과 질감", "설탕보다 낮은 칼로리(약 40% 감소)", "충치 유발 가능성 낮음"))
                .cons(List.of("과다 섭취 시 소화기계 불편함 유발", "다른 당알코올에 비해 상대적으로 높은 혈당 지수", "일부 제품에서 높은 가격"))
                .diabetic(List.of("혈당 지수가 35로 설탕(GI 65)보다 낮지만, 다른 당알코올에 비해 높은 편입니다.", "소량으로 시작하여 혈당 반응을 모니터링 하는 것이 좋습니다.", "식사 계획에 포함할 때 의료 전문가와 상담하세요."))
                .kidneyPatient(List.of("신장 질환이 있는 경우 당알코올 대시에 영향을 줄 수 있습니다.", "의료 전문가와 상담 후 섭취 여부를 결정하세요."))
                .Dieter(List.of("설탕보다 약 40% 낮은 칼로리를 제공합니다.", "과다 섭취 시 소화기계 불편함이 체중 관리에 방해가 될 수 있습니다."))
                .muscleBuilder(List.of("운동 전후 에너지원으로는 완전한 탄수화물보다 효과적이지 않을 수 있습니다.", "단백질 바나 스포츠 영양 제품에 자주 사용됩니다."))
                .recommendedDailyIntake(50)
                .regulatory("FDA(미국 식품의약국)와 EFSA(유럽 식품안전청)에서 식품 첨가물로 승인되었습니다. 한국 식약처에서도 식품 첨가물로 허용되고 있습니다.")
                .issue("일부 연구에서 장기적인 사용과 장내 미생물 변화의 연관성이 제기되었으나, 현재까지 명확한 결론은 없습니다.")
                .compareTable(List.of(
                        new IngredientDictionary.CompareItem("에리스리톨", 0, 0.2f, 0.7f, "안심"),
                        new IngredientDictionary.CompareItem("자일리톨", 7, 2.4f, 1.0f, "주의"),
                        new IngredientDictionary.CompareItem("설탕", 65, 4, 1.0f, "위험")
                ))
                .build();

        encyclopediaRepository.save(ingredient);
    }

    public List<EncyclopediaSearchResponse> searchIngredients(String query) {
        List<EncyclopediaSearchResponse> results = encyclopediaRepository.findByNameContaining(query)
                .stream()
                .map(EncyclopediaSearchResponse::from)
                .toList();

        // 검색 결과가 존재하면 첫 번째 결과의 정확한 성분명으로 Redis 카운트 증가
        if (!results.isEmpty()) {
            String accurateName = results.get(0).getName(); // ex. "말티톨"
            popularIngredientService.incrementSearchCount(accurateName);
        }

        return results;
    }

    public EncyclopediaDetailResponse getIngredientDetail(String id) {
        IngredientDictionary ingredient = encyclopediaRepository.findById(id)
                .orElseThrow(() -> new IngredientException(ErrorCode.INGREDIENT_NOT_FOUND));
        return EncyclopediaMapper.toDetailResponse(ingredient);
    }

}
