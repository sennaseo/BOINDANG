package com.boindang.encyclopedia.presentation;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.encyclopedia.application.ReportService;
import com.boindang.encyclopedia.common.response.BaseResponse;
import com.boindang.encyclopedia.presentation.dto.request.ReportRequest;
import com.boindang.encyclopedia.presentation.dto.response.UserReportResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class ReportController {

	private final ReportService reportService;

	@PostMapping("/user-type")
	public BaseResponse<UserReportResponse> getReport(
		@RequestBody ReportRequest request
	) {
		return BaseResponse.success(
			reportService.getUserReport(request.getIngredients(), request.getUserType())
		);
	}
}
