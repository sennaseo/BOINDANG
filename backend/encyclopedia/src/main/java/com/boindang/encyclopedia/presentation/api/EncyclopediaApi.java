package com.boindang.encyclopedia.presentation.api;

import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaDetailResponse;
import com.boindang.encyclopedia.presentation.dto.response.IngredientListResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@Tag(name = "백과사전", description = "영양 성분 백과사전 관련 API입니다.")
public interface EncyclopediaApi {

    @Operation(summary = "성분 검색", description = "검색어를 기준으로 성분 검색을 수행합니다. 기본적으로 오타 교정을 수행하며, 'suggested=false'로 설정하면 입력한 검색어 그대로 검색합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성분 검색 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                {
                                   "data": {
                                     "originalQuery": "말티톨",
                                     "suggestedName": null,
                                     "results": [
                                       {
                                         "id": "maltitol",
                                         "name": "말티톨",
                                         "engName": "Maltitol",
                                         "type": "당알코올 감미료",
                                         "riskLevel": "주의"
                                       }
                                     ]
                                   },
                                   "error": null,
                                   "success": true
                                 }
                        """))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                {
                                  "data": null,
                                  "error": {
                                    "status": "BAD_REQUEST",
                                    "message": "검색어를 입력해주세요."
                                  },
                                  "success": false
                                }
                        """)))
    })
    @GetMapping("/search")
    com.boindang.encyclopedia.common.response.ApiResponses<Map<String, Object>> searchIngredients(
            @Parameter(description = "검색 키워드 (예: 말티톨, 말티 등)", required = true)
            @RequestParam String query,

            @Parameter(description = "오타 교정 사용 여부 (기본값 true)")
            @RequestParam(required = false, defaultValue = "true") Boolean suggested
    );

    @Operation(summary = "성분 상세 조회", description = "성분 ID를 기반으로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성분 상세 조회 성공", content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(value = """
                        {
                          "data": {
                            "id": "maltitol",
                            "name": "말티톨",
                            "engName": "Maltitol",
                            "category": "감미료",
                            "type": "당알코올 감미료",
                            "riskLevel": "주의",
                            "gi": 35,
                            "calories": 2.1,
                            "sweetness": 0.9,
                            "description": "말티톨은 자연에서 발견되는 당알코올의 일종으로, 주로 설탕을 대체하는 감미료로 사용됩니다. 설탕과 유사한 맛과 질감을 가지고 있어 무설탕 또는 저설탕 제품에 널리 사용됩니다. 말티톨은 설탕보다 칼로리가 낮고 혈당 지수가 낮아 당뇨병 환자나 체중 관리가 필요한 사람들에게 대안으로 제시되기도 합니다.",
                            "examples": [
                              "무설탕 초콜릿 및 사탕",
                              "저당 아이스크림",
                              "당뇨병 환자용 특수 식품",
                              "무설탕 껌 및 민트",
                              "단백질 바 및 영양 보충제"
                            ],
                            "references": [
                              "European Food Safety Authority (2011)",
                              "Livesey G. (2003)",
                              "Kearsley & Deis (2012)"
                            ],
                            "bloodResponse": "말티톨은 설탕보다 혈당 지수(GI)가 낮지만, 다른 당알코올에 비해 상대적으로 높은 편입니다. 혈당 조절이 중요한 당뇨병 환자는 섭취량에 주의해야 합니다.",
                            "digestEffect": "소화 과정에서 완전히 흡수되지 않아 과다 섭취 시 복부 팽만감, 가스, 설사 등 소화기계 불편함을 유발할 수 있습니다. 일반적으로 20-30g 이상 섭취 시 이러한 부작용이 나타날 수 있습니다.",
                            "toothEffect": "충치를 유발하는 박테리아가 말티톨을 발효시키지 못해 충치 예방에 도움이 됩니다.",
                            "pros": [
                              "설탕과 유사한 맛과 질감",
                              "설탕보다 낮은 칼로리(약 40% 감소)",
                              "충치 유발 가능성 낮음"
                            ],
                            "cons": [
                              "과다 섭취 시 소화기계 불편함 유발",
                              "다른 당알코올에 비해 상대적으로 높은 혈당 지수",
                              "일부 제품에서 높은 가격"
                            ],
                            "diabetic": [
                              "혈당 지수가 35로 설탕(GI 65)보다 낮지만, 다른 당알코올에 비해 높은 편입니다.",
                              "소량으로 시작하여 혈당 반응을 모니터링 하는 것이 좋습니다.",
                              "식사 계획에 포함할 때 의료 전문가와 상담하세요."
                            ],
                            "kidneyPatient": [
                              "신장 질환이 있는 경우 당알코올 대시에 영향을 줄 수 있습니다.",
                              "의료 전문가와 상담 후 섭취 여부를 결정하세요."
                            ],
                            "dieter": [
                              "설탕보다 약 40% 낮은 칼로리를 제공합니다.",
                              "과다 섭취 시 소화기계 불편함이 체중 관리에 방해가 될 수 있습니다."
                            ],
                            "muscleBuilder": [
                              "운동 전후 에너지원으로는 완전한 탄수화물보다 효과적이지 않을 수 있습니다.",
                              "단백질 바나 스포츠 영양 제품에 자주 사용됩니다."
                            ],
                            "recommendedDailyIntake": "말티톨은 일일권장섭취량(ADI)이 별도로 설정되지 않았지만, 과량 섭취 (1일 20g 이상) 시 삼투성 설사를 유발할 수 있으므로 주의가 필요합니다.",
                            "regulatory": "FDA와 EFSA에서 식품 첨가물로 승인되었으며, 한국 식약처에서도 허용되고 있습니다.",
                            "issue": "일부 연구에서 장기적인 사용과 장내 미생물 변화의 연관성이 제기되었으나, 현재까지 명확한 결론은 없습니다.",
                            "labels": [
                              "GI지수",
                              "칼로리(kcal/g)",
                              "상대 감미도",
                              "위험등급"
                            ],
                            "compareTable": {
                              "rows": [
                                {
                                  "name": "에리스리톨",
                                  "values": [
                                    "0",
                                    "0.2",
                                    "0.7",
                                    "안심"
                                  ]
                                },
                                {
                                  "name": "자일리톨",
                                  "values": [
                                    "7",
                                    "2.4",
                                    "1",
                                    "주의"
                                  ]
                                },
                                {
                                  "name": "설탕",
                                  "values": [
                                    "65",
                                    "4",
                                    "1",
                                    "위험"
                                  ]
                                }
                              ]
                            }
                          },
                          "error": null,
                          "success": true
                        }
                            """)
            )),
            @ApiResponse(responseCode = "404", description = "성분을 찾을 수 없음", content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(value = """
                        {
                          "data": null,
                          "error": {
                            "status": "NOT_FOUND",
                            "message": "해당 성분을 찾을 수 없습니다."
                          },
                          "success": false
                        }
                        """)
            ))
    })
    @GetMapping("/ingredient/{id}")
    com.boindang.encyclopedia.common.response.ApiResponses<EncyclopediaDetailResponse> getDetail(
            @Parameter(description = "성분 ID", required = true) @PathVariable String id);

    @Operation(summary = "카테고리별 성분 조회", description = "성분 유형(감미료, 보존제 등)에 따라 필터링하고 GI 또는 감미도 정렬을 지원합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성분 리스트 조회 성공", content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(value = """
                        {
                            "data": {
                                "totalPages": 1,
                                "ingredients": [
                                  {
                                    "id": "maltitol",
                                    "name": "말티톨",
                                    "engName": "Maltitol",
                                    "type": "당알코올 감미료",
                                    "riskLevel": "주의"
                                  },
                                  {
                                    "id": "stevia",
                                    "name": "스테비아",
                                    "engName": "Stevia",
                                    "type": "천연 감미료",
                                    "riskLevel": "안심"
                                  }
                                ]
                              },
                            "error": null,
                            "success": true
                        }
                    """)
            )),
            @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content(
                    mediaType = "application/json",
                    examples = @ExampleObject(value = """
                        {
                            "data": null,
                            "error": {
                                "status": "BAD_REQUEST",
                                "message": "존재하지 않는 카테고리입니다."
                            },
                            "success": false
                        }
                    """)
            ))
    })
    @GetMapping("/category")
    com.boindang.encyclopedia.common.response.ApiResponses<IngredientListResponse> getIngredientsByCategory(
            @Parameter(description = "성분 유형", required = true) @RequestParam String category,
            @Parameter(description = "정렬 기준 (gi | sweetness)") @RequestParam(required = false) String sort,
            @Parameter(description = "정렬 방향 (asc | desc)") @RequestParam(defaultValue = "desc") String order,
            @Parameter(description = "조회 개수") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "페이지 번호") @RequestParam(defaultValue = "0") int page
    );
}
