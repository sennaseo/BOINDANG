package com.boindang.encyclopedia.presentation;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.encyclopedia.application.ReportService;
import com.boindang.encyclopedia.common.response.ApiResponses;
import com.boindang.encyclopedia.presentation.dto.request.ReportRequest;
import com.boindang.encyclopedia.presentation.dto.response.UserReportResponse;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class ReportController {

	private final ReportService reportService;

	@Operation(summary = "성분 이름 목록으로 성분 정보 목록 조회 (for 유진)", description = "성분리스트 보내면 정보 쭈루룩 + 위험 성분 top3까G")
	@PostMapping("/user-type")
	public ApiResponses<UserReportResponse> getReport(@RequestBody ReportRequest request) {
		return ApiResponses.success(reportService.getUserReport(request.getIngredients(), request.getUserType()));
	}
}
