package com.boindang.campaign.presentation.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.boindang.campaign.common.response.BaseResponse;
import com.boindang.campaign.presentation.dto.response.ApplyResultResponse;

@RequestMapping("/campaigns")
public interface CampaignApi {

	@Operation(summary = "체험단 신청 API", description = "선착순 체험단에 신청합니다.")
	@ApiResponses(value = {
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
		@ApiResponse(responseCode = "404", description = "존재하지 않는 캠페인입니다."),
		@ApiResponse(responseCode = "500", description = "Kafka 이벤트 전송 중 오류가 발생했습니다.")
	})
	@PostMapping("/{campaignId}/apply")
	BaseResponse<ApplyResultResponse> apply(
		@Parameter(description = "캠페인 ID", required = true)
		@PathVariable("campaignId") Long campaignId,

		@Parameter(description = "사용자 ID", required = true)
		@RequestParam Long userId
	);
}

