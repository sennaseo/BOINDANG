package com.boindang.campaign.presentation.controller;

import com.boindang.campaign.common.response.BaseResponse;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/campaigns")
@Tag(name = "체험단", description = "체험단 관련 API입니다.")
public interface CampaignApi {

	@Operation(
		summary = "체험단 신청",
		description = "해당 캠페인 ID에 대해 사용자가 체험단을 신청합니다. 중복 신청 및 정원 초과 여부는 Redis 기반으로 처리됩니다."
	)
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "체험단 신청 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
				  "isSuccess": true,
				  "code": 201,
				  "message": "체험단 신청이 완료되었습니다.",
				  "data": {
					"campaignId": 1,
					"isSelected": true
				  }
				}
            """)
			)
		),
		@ApiResponse(responseCode = "409", description = "이미 신청한 경우",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
                  "isSuccess": false,
                  "code": 409,
                  "message": "이미 신청하신 캠페인입니다."
                }
            """)
			)
		),
		@ApiResponse(responseCode = "400", description = "모집 마감 또는 불가능한 상태",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
                  "isSuccess": false,
                  "code": 400,
                  "message": "현재 신청할 수 없는 캠페인입니다."
                }
            """)
			)
		),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 캠페인에 신청한 경우",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
                  "isSuccess": false,
                  "code": 404,
                  "message": "해당 캠페인이 존재하지 않습니다."
                }
            """)
			)
		)
	})
	@PostMapping("/{campaignId}/apply")
	public BaseResponse<ApplyResultResponse> apply(
		@Parameter(description = "캠페인 ID", required = true)
		@PathVariable Long campaignId,

		@Parameter(description = "사용자 ID (임시로 직접 입력)", required = true)
		@RequestParam Long userId
	);
}
