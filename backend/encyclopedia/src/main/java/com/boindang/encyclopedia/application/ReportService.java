package com.boindang.encyclopedia.application;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.boindang.encyclopedia.domain.ReportDocument;
import com.boindang.encyclopedia.infrastructure.ReportElasticsearchRepository;
import com.boindang.encyclopedia.presentation.dto.response.IngredientReportResponse;
import com.boindang.encyclopedia.presentation.dto.response.RiskIngredientSummary;
import com.boindang.encyclopedia.presentation.dto.response.UserReportResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

	private final ReportElasticsearchRepository reportRepository;

	public UserReportResponse getUserReport(List<String> ingredientNames, String userType) {
		List<ReportDocument> documents = reportRepository.findByNameIn(ingredientNames);

		List<IngredientReportResponse> ingredientResponses = new ArrayList<>();
		List<RiskIngredientSummary> riskyIngredients = new ArrayList<>();

		for (ReportDocument doc : documents) {
			String risk = getRiskLevelByUserType(doc.getRiskLevel(), userType);
			int score = getScoreByUserType(doc, userType);
			List<String> userMessage = getMessageByUserType(doc, userType);

			ingredientResponses.add(IngredientReportResponse.builder()
				.name(doc.getName())
				.gi(doc.getGi())
				.shortMessage(doc.getShortMessage())
				.description(doc.getDescription())
				.riskLevel(risk)
				.build()
			);

			if ("주의".equals(risk) || "높음".equals(risk)) {
				riskyIngredients.add(RiskIngredientSummary.builder()
					.title(userMessage.get(0))
					.message(userMessage.get(1))
					.build()
				);
			}
		}

		// 위험 성분 점수순 정렬
		riskyIngredients = documents.stream()
			.filter(doc -> {
				String risk = getRiskLevelByUserType(doc.getRiskLevel(), userType);
				return "주의".equals(risk) || "높음".equals(risk);
			})
			.sorted((a, b) -> Integer.compare(
				getScoreByUserType(b, userType),
				getScoreByUserType(a, userType)
			))
			.map(doc -> {
				List<String> msg = getMessageByUserType(doc, userType);
				return RiskIngredientSummary.builder()
					.title(msg.get(0))
					.message(msg.get(1))
					.build();
			})
			.collect(Collectors.toList());

		return UserReportResponse.builder()
			.ingredients(ingredientResponses)
			.topRisks(riskyIngredients)
			.build();
	}

	private String getRiskLevelByUserType(ReportDocument.RiskLevel riskLevel, String userType) {
		return switch (userType.toLowerCase()) {
			case "diabetic" -> riskLevel.getDiabetic();
			case "kidneyPatient" -> riskLevel.getKidneyPatient();
			case "dieter" -> riskLevel.getDieter();
			case "muscleBuilder" -> riskLevel.getMuscleBuilder();
			default -> riskLevel.getDefaultLevel();
		};
	}

	private int getScoreByUserType(ReportDocument doc, String userType) {
		return switch (userType.toLowerCase()) {
			case "diabetic" -> doc.getDiabeticScore();
			case "kidneyPatient" -> doc.getKidneyPatientScore();
			case "dieter" -> doc.getDieterScore();
			case "muscleBuilder" -> doc.getMuscleBuilderScore();
			default -> 0;
		};
	}

	private List<String> getMessageByUserType(ReportDocument doc, String userType) {
		return switch (userType.toLowerCase()) {
			case "diabetic" -> doc.getDiabetic();
			case "kidneyPatient" -> doc.getKidneyPatient();
			case "dieter" -> doc.getDieter();
			case "muscleBuilder" -> doc.getMuscleBuilder();
			default -> List.of("정보 없음", "해당 유저 타입에 대한 설명이 없습니다.");
		};
	}
}

