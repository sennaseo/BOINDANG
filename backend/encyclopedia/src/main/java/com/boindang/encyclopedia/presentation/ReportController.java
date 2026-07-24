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

	@Operation(summary = "성분 이름 목록으로 성분 정보 목록 조회", description = "성분 이름 리스트와 유저 타입을 보내면 성분 상세 정보 목록과 위험 성분 Top3를 반환합니다.")
	@PostMapping("/user-type")
	public ApiResponses<UserReportResponse> getReport(@RequestBody ReportRequest request) {
		return ApiResponses.success(reportService.getUserReport(request.getIngredients(), request.getUserType()));
	}
}
