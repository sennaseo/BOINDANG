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
		@ApiResponse(responseCode = "200", description = "체험단 목록 조회에 성공하였습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					  "data": {
					    "totalPages": 4,
					    "campaigns": [
					      {
					        "id": 1,
					        "name": "코카콜라 제로 190ml",
					        "content": "제로칼로리 탄산음료입니다.",
					        "imageUrl": "https://boindang.s3.ap-northeast-2.amazonaws.com/%EC%BD%94%EC%B9%B4%EC%BD%9C%EB%9D%BC%EC%A0%9C%EB%A1%9C(%EC%B2%B4%ED%97%98%EB%8B%A8).png",
					        "startDate": "2025-05-01T00:00:00",
					        "deadline": "2025-05-20T23:59:59",
					        "status": "진행중",
					        "capacity": 5,
					        "hashtags": [
					          "제로",
					          "무설탕",
					          "탄산"
					        ],
					        "applied": true
					      },
					      {
					        "id": 4,
					        "name": "제로슈거 콜라맛 사탕",
					        "content": "톡쏘는 콜라 맛 그대로! 설탕은 제로, 맛은 100점!",
					        "imageUrl": "https://boindang.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%EB%A1%9C%EC%8A%88%EA%B1%B0+%EC%BD%9C%EB%9D%BC%EB%A7%9B+%EC%82%AC%ED%83%95(%EC%B2%B4%ED%97%98%EB%8B%A8).png",
					        "startDate": "2025-05-10T00:00:00",
					        "deadline": "2025-05-20T23:59:59",
					        "status": "진행중",
					        "capacity": 10,
					        "hashtags": [
					          "제로슈거",
					          "콜라사탕",
					          "당걱정끝"
					        ],
					        "applied": false
					      },
					      {
					        "id": 11,
					        "name": "립톤 제로슈거 아이스티 335ml",
					        "content": "달달한 복숭아 향기와 맛을 품은 제로슈거 아이스티",
					        "imageUrl": "https://boindang.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%EB%A1%9C%EC%8A%88%EA%B1%B0+%EC%95%84%EC%9D%B4%EC%8A%A4%ED%8B%B0(%EC%B2%B4%ED%97%98%EB%8B%A8).jpg",
					        "startDate": "2025-05-07T00:00:00",
					        "deadline": "2025-05-22T23:59:59",
					        "status": "진행중",
					        "capacity": 10,
					        "hashtags": [
					          "제로슈거",
					          "아이스티",
					          "여름간식"
					        ],
					        "applied": false
					      },
					      {
					        "id": 2,
					        "name": "무설탕 딸기 쉐이크",
					        "content": "인공 감미료 없이 진짜 딸기의 맛! 건강한 하루를 시작하세요.",
					        "imageUrl": "https://boindang.s3.ap-northeast-2.amazonaws.com/%EB%AC%B4%EC%84%A4%ED%83%95+%EB%94%B8%EA%B8%B0+%EC%89%90%EC%9D%B4%ED%81%AC(%EC%B2%B4%ED%97%98%EB%8B%A8).png",
					        "startDate": "2025-05-13T00:00:00",
					        "deadline": "2025-05-23T23:59:59",
					        "status": "진행중",
					        "capacity": 10,
					        "hashtags": [
					          "무설탕",
					          "딸기쉐이크",
					          "단백질가득"
					        ],
					        "applied": false
					      },
					      {
					        "id": 3,
					        "name": "저당 프로틴 초코바 (6개입)",
					        "content": "당 걱정 없이 즐기는 단백질 충전! 운동 후 간식으로 추천",
					        "imageUrl": "https://boindang.s3.ap-northeast-2.amazonaws.com/%EC%A0%80%EB%8B%B9+%ED%94%84%EB%A1%9C%ED%8B%B4+%EC%B4%88%EC%BD%94%EB%B0%94(%EC%B2%B4%ED%97%98%EB%8B%A8).png",
					        "startDate": "2025-05-09T00:00:00",
					        "deadline": "2025-05-25T23:59:59",
					        "status": "진행중",
					        "capacity": 7,
					        "hashtags": [
					          "저당",
					          "프로틴바",
					          "헬스간식"
					        ],
					        "applied": false
					      }
					    ]
					  },
					  "error": null,
					  "success": true
					}
                """))),
		@ApiResponse(responseCode = "400", description = "체험단 상태가 유효하지 않은 상태입니다.",
			content = @Content(mediaType = "application/json",
			examples = @ExampleObject(value = """
                    {
				  "data": null,
				  "error": {
				    "status": "BAD_REQUEST",
				    "message": "유효하지 않은 상태입니다."
				  },
				  "success": false
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
					  "data": {
					    "id": 1,
					    "name": "코카콜라 제로 190ml",
					    "content": "제로칼로리 탄산음료입니다.",
					    "mainCategory": "음료",
					    "subCategory": "탄산음료",
					    "imageUrl": "https://boindang.s3.ap-northeast-2.amazonaws.com/%EC%BD%94%EC%B9%B4%EC%BD%9C%EB%9D%BC%EC%A0%9C%EB%A1%9C(%EC%B2%B4%ED%97%98%EB%8B%A8).png",
					    "startDate": "2025-05-01T00:00:00",
					    "deadline": "2025-05-20T23:59:59",
					    "status": "진행중",
					    "capacity": 5,
					    "applicantCount": 5,
					    "hashtags": [
					      "제로",
					      "무설탕",
					      "탄산"
					    ],
					    "notices": [
					      "냉장 보관 필수",
					      "음용 전 흔들지 마세요",
					      "마감 후 배송까지 최대 7일 소요될 수 있습니다."
					    ],
					    "applied": true
					  },
					  "error": null,
					  "success": true
					}
                """))),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 캠페인입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					  "data": null,
					  "error": {
					    "status": "NOT_FOUND",
					    "message": "해당 체험단이 존재하지 않습니다."
					  },
					  "success": false
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
					      "data": {
					        "campaignId": 1,
					        "selected": true
					      },
					      "error": null,
					      "success": true
					    }
                """))),
		@ApiResponse(responseCode = "200", description = "정원이 마감되었습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					      "data": {
					        "campaignId": 1,
					        "selected": false
					      },
					      "error": null,
					      "success": true
					    }
                """))),
		@ApiResponse(responseCode = "409", description = "이미 신청한 체험단입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					       "data": null,
					       "error": {
					         "status": "CONFLICT",
					         "message": "이미 신청하신 체험단입니다."
					       },
					       "success": false
					     }
                """))),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 캠페인입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					      "data": null,
					      "error": {
					        "status": "NOT_FOUND",
					        "message": "해당 체험단이 존재하지 않습니다."
					      },
					      "success": false
					    }
                """))),
		@ApiResponse(responseCode = "500", description = "Kafka 이벤트 전송 중 오류가 발생했습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                    {
					      "data": null,
					      "error": {
					        "status": "INTERNAL_SERVER_ERROR",
					        "message": "Kafka 이벤트 전송 중 오류가 발생했습니다."
					      },
					      "success": false
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
					       "data": [
					         {
					           "campaignId": 1,
					           "title": "코카콜라 제로 190ml",
					           "isSelected": true,
					           "appliedAt": "2025-05-14T15:18:23"
					         },
					         {
					           "campaignId": 2,
					           "title": "무설탕 딸기 쉐이크",
					           "isSelected": true,
					           "appliedAt": "2025-05-18T14:05:36"
					         }
					       ],
					       "error": null,
					       "success": true
					     }
            """))),
		@ApiResponse(responseCode = "400", description = "잘못된 요청입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
					       "data": null,
					       "error": {
					         "status": "UNAUTHORIZED",
					         "message": "유효하지 않은 사용자입니다."
					       },
					       "success": false
					     }
            """)))
	})
	@GetMapping("/my-applications")
	ApiResponses<List<MyApplicationResponse>> getMyApplications(
		@Parameter(description = "사용자 ID", required = true)
		@RequestHeader("X-User-Id") String userId
	);

}

