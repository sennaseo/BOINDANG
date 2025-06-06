package com.boindang.encyclopedia.presentation;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.encyclopedia.infrastructure.EncyclopediaJpaRepository;
import com.boindang.encyclopedia.presentation.dto.response.EncyclopediaSearchTestResponse;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class PerformanceTestController {

	private final EncyclopediaJpaRepository encyclopediaRepository;
	@Operation(summary = "Elasticsearch 성능 조회 테스트용 API (with MySQL)", description = "Elasticsearch vs MySQL 과연.. 승자는??")
	@GetMapping("/search/mysql")
	public List<EncyclopediaSearchTestResponse> searchMysql(@RequestParam String query) {
		return encyclopediaRepository.findByNameContaining(query)
			.stream()
			.map(EncyclopediaSearchTestResponse::from)
			.toList();
	}

}
