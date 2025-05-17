package com.boindang.campaign.presentation.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.boindang.campaign.common.response.ApiResponses;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;
import com.boindang.campaign.presentation.dto.response.CampaignDetailResponse;
import com.boindang.campaign.presentation.dto.response.CampaignListResponse;
import com.boindang.campaign.presentation.dto.response.MyApplicationResponse;

@Tag(name = "체험단", description = "체험단 관련 API입니다.")
public interface CampaignApi {

	@Operation(summary = "체험단 목록 조회", description = "전체 체험단 목록을 상태 기준으로 조회합니다. 상태(status)는 '모집 예정', '진행중', '종료' 중 선택 가능합니다.")
	@io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "체험단 목록 조회 성공",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					  "isSuccess": true,
					  "code": 200,
					  "message": "체험단 목록 조회가 완료되었습니다.",
					  "data": [
					    {
					      "id": 1,
					      "name": "코카콜라 제로 190ml",
					      "content": "제로칼로리 탄산음료입니다.",
					      "imageUrl": "https://example.com/coke.jpg",
					      "deadline": "2025-05-20",
					      "status": "모집중",
					      "capacity": 3,
					      "hashtags": [
					        "제로",
					        "무설탕",
					        "탄산"
					      ]
				        }
		  		      ]
					}
                """))),
		@ApiResponse(responseCode = "500", description = "체험단 목록 조회 중 오류 발생",
			content = @Content(mediaType = "application/json",
			examples = @ExampleObject(value = """
                    {
					  "isSuccess": false,
					  "code": 500,
					  "message": "체험단 목록 조회 중 오류가 발생하였습니다.",
					  "data": null
					}
                """)))
	})
	@GetMapping
	com.boindang.campaign.common.response.ApiResponses<CampaignListResponse> getCampaigns(
		@Parameter(description = "사용자 ID", required = true)
		@RequestHeader("X-User-Id") String userId,

		@Parameter(description = "체험단 상태 필터 ('모집 예정', '진행중', '종료')")
		@RequestParam(required = false) String status,

		@Parameter(description = "페이지 크기", example = "5")
		@RequestParam(defaultValue = "5") int size,

		@Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
		@RequestParam(defaultValue = "0") int page
	);

	@Operation(summary = "체험단 상세 조회", description = "체험단 공고의 상세 내용을 모두 조회합니다. 로그인 없이 접근 가능하지만, 내가 신청했는지 여부는 로그인 상태에서만 확인이 가능합니다.")
	@io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "체험단 상세 조회가 완료되었습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					  "isSuccess": true,
					  "code": 200,
					  "message": "체험단 상세 조회가 완료되었습니다.",
					  "data": {
					    "id": 1,
					    "name": "코카콜라 제로 190ml",
					    "content": "제로칼로리 탄산음료입니다.",
					    "mainCategory": "음료",
					    "subCategory": "탄산음료",
					    "imageUrl": "https://example.com/coke.jpg",
					    "startDate": "2025-05-01",
					    "deadline": "2025-05-20",
					    "status": "모집중",
					    "capacity": 3,
					    "applicantCount": 1,
					    "hashtags": [
					      "제로",
					      "무설탕",
					      "탄산"
					    ],
					    "notices": [
					      "냉장 보관 필수",
					      "음용 전 흔들지 마세요",
					      "마감 후 배송까지 최대 7일 소요될 수 있습니다."
					    ]
					  }
					}
                """))),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 캠페인입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					  "isSuccess": false,
					  "code": 404,
					  "message": "존재하지 않는 캠페인입니다.",
					  "data": null
					}
                """)))
	})
	@GetMapping("/{campaignId}")
	ApiResponses<CampaignDetailResponse> getCampaignDetail(
		@Parameter(description = "사용자 ID", required = true)
		@RequestHeader("X-User-Id") String userId,

		@Parameter(description = "캠페인 ID", required = true)
		@PathVariable("campaignId") Long campaignId
	);

	@Operation(summary = "체험단 신청 API", description = "선착순 체험단에 신청합니다. 이 서비스는 로그인이 되어야만 사용할 수 있는 서비스입니다.")
	@io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
		@ApiResponse(responseCode = "201", description = "체험단 신청이 완료되었습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
                      "isSuccess": true,
                      "code": 201,
                      "message": "체험단 신청이 완료되었습니다.",
                      "data": {
                        "campaignId": 1,
                        "selected": true
                      }
                    }
                """))),
		@ApiResponse(responseCode = "200", description = "정원이 마감되었습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
                      "isSuccess": true,
                      "code": 200,
                      "message": "정원이 마감되었습니다.",
                      "data": {
                        "campaignId": 1,
                        "selected": false
                      }
                    }
                """))),
		@ApiResponse(responseCode = "400", description = "이미 신청한 유저입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
                      "isSuccess": false,
                      "code": 400,
                      "message": "이미 신청한 체험단입니다.",
                      "data": null
                    }
                """))),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 캠페인입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
                      "isSuccess": false,
                      "code": 404,
                      "message": "존재하지 않는 캠페인입니다.",
                      "data": null
                    }
                """))),
		@ApiResponse(responseCode = "500", description = "Kafka 이벤트 전송 중 오류가 발생했습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
                      "isSuccess": false,
                      "code": 500,
                      "message": "Kafka 이벤트 전송 중 오류가 발생했습니다.",
                      "data": null
                    }
                """)))
	})
	@PostMapping("/{campaignId}/apply")
	ApiResponses<ApplyResultResponse> apply(
		@Parameter(description = "캠페인 ID", required = true)
		@PathVariable("campaignId") Long campaignId,

		@Parameter(description = "사용자 ID", required = true)
		@RequestHeader("X-User-Id") String userId
	);

	@Operation(
		summary = "내 체험단 신청 내역 조회 API",
		description = "로그인한 사용자의 체험단 신청 내역을 조회합니다. (마이페이지에서 사용됨)"
	)
	@io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "내 신청 내역 조회 성공",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
                  "isSuccess": true,
                  "code": 200,
                  "message": "내 신청 내역 조회 성공",
                  "data": [
                    {
                      "campaignId": 1,
                      "title": "제로콜라 체험단 모집",
                      "isSelected": true,
                      "appliedAt": "2025-04-29T10:12:00"
                    }
                  ]
                }
            """))),
		@ApiResponse(responseCode = "400", description = "잘못된 요청입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
                  "isSuccess": false,
                  "code": 400,
                  "message": "userId는 필수입니다.",
                  "data": null
                }
            """)))
	})
	@GetMapping("/my-applications")
	ApiResponses<List<MyApplicationResponse>> getMyApplications(
		@Parameter(description = "사용자 ID", required = true)
		@RequestHeader("X-User-Id") String userId
	);

}

