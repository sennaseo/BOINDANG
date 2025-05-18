package com.boindang.encyclopedia.application;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.boindang.encyclopedia.domain.IngredientDictionary;
import com.boindang.encyclopedia.domain.ReportDocument;
import com.boindang.encyclopedia.infrastructure.EncyclopediaRepository;
import com.boindang.encyclopedia.infrastructure.ReportElasticsearchRepository;
import com.boindang.encyclopedia.presentation.dto.response.IngredientReportResponse;
import com.boindang.encyclopedia.presentation.dto.response.RiskIngredientSummary;
import com.boindang.encyclopedia.presentation.dto.response.UserReportResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

	private final ReportElasticsearchRepository reportRepository;
	private final EncyclopediaRepository ingredientRepository;

	public UserReportResponse getUserReport(List<String> ingredientNames, String userType) {
		// 1. ingredients, reports 조회
		List<ReportDocument> reports = reportRepository.findByNameIn(ingredientNames);
		List<IngredientDictionary> ingredients = ingredientRepository.findByNameIn(ingredientNames);

		// 2. 이름으로 빠르게 찾기 위한 map 구성
		Map<String, IngredientDictionary> ingredientMap = ingredients.stream()
			.collect(Collectors.toMap(IngredientDictionary::getName, i -> i));

		Map<String, ReportDocument> reportMap = reports.stream()
			.collect(Collectors.toMap(ReportDocument::getName, r -> r));

		List<IngredientReportResponse> ingredientResponses = new ArrayList<>();
		List<RiskIngredientData> riskyList = new ArrayList<>();

		for (String name : ingredientNames) {
			IngredientDictionary ingredient = ingredientMap.get(name);
			ReportDocument report = reportMap.get(name);

			String riskLevel = report != null
				? getRiskLevelByUserType(
				report.getRiskLevel(),
				userType,
				(ingredient != null && ingredient.getRiskLevel() != null)
					? ingredient.getRiskLevel().getLabel()
					: "정보 없음"
			)
				: (ingredient != null && ingredient.getRiskLevel() != null)
				? ingredient.getRiskLevel().getLabel()
				: "정보 없음";

			int score = report != null ? getScoreByUserType(report, userType) : 0;
			List<String> userMessage = report != null ? getMessageByUserType(report, userType) : List.of("정보 없음", "해당 성분에 대한 설명이 없습니다.");

			ingredientResponses.add(IngredientReportResponse.builder()
				.name(name)
				.gi(ingredient != null ? ingredient.getGi() : 0)
				.shortMessage(report != null ? report.getShortMessage() : "설명이 없습니다.")
				.keyword(report != null ? report.getKeyword() : "정보 없음")
				.description(Collections.singletonList(ingredient != null ? ingredient.getDescription() : "설명이 없습니다."))
				.riskLevel(riskLevel)
				.build());


			if ("주의".equals(riskLevel) || "높음".equals(riskLevel)) {
				riskyList.add(new RiskIngredientData(score, userMessage));
			}
		}

		// 3. 위험 성분 정렬 및 Top 3 추출
		List<RiskIngredientSummary> topRisks = reports.stream()
			.filter(doc -> {
				IngredientDictionary ingredient = ingredientMap.get(doc.getName());
				String fallbackRisk = (ingredient != null && ingredient.getRiskLevel() != null)
					? ingredient.getRiskLevel().getLabel()
					: "정보 없음";

				String risk = getRiskLevelByUserType(doc.getRiskLevel(), userType, fallbackRisk);
				return "주의".equals(risk) || "높음".equals(risk);
			})
			.sorted(Comparator.comparingInt(doc -> getScoreByUserType((ReportDocument)doc, userType)).reversed())  // ✅ 정렬 여기서
			.map(doc -> {
				List<String> msg = getMessageByUserType(doc, userType);
				return RiskIngredientSummary.builder()
					.name(doc.getName())
					.keyword(msg.get(0))
					.title(msg.get(1))
					.detail(msg.get(2))
					.build();
			})
			.limit(3)
			.toList();


		return UserReportResponse.builder()
			.ingredients(ingredientResponses)
			.topRisks(topRisks)
			.build();
	}

	private String getRiskLevelByUserType(ReportDocument.RiskLevel reportRisk, String userType, String ingredientRiskLevel) {
		return switch (userType.toLowerCase()) {
			case "diabetic" -> reportRisk.getDiabetic();
			case "kidneypatient" -> reportRisk.getKidneyPatient();
			case "dieter" -> reportRisk.getDieter();
			case "musclebuilder" -> reportRisk.getMuscleBuilder();
			default -> ingredientRiskLevel != null ? ingredientRiskLevel : "정보 없음";
		};
	}

	private int getScoreByUserType(ReportDocument doc, String userType) {
		return switch (userType.toLowerCase()) {
			case "diabetic" -> doc.getDiabeticScore();
			case "kidneypatient" -> doc.getKidneyPatientScore();
			case "dieter" -> doc.getDieterScore();
			case "musclebuilder" -> doc.getMuscleBuilderScore();
			default -> 0;
		};
	}

	private List<String> getMessageByUserType(ReportDocument doc, String userType) {
		return switch (userType.toLowerCase()) {
			case "diabetic" -> doc.getDiabetic();
			case "kidneypatient" -> doc.getKidneyPatient();
			case "dieter" -> doc.getDieter();
			case "musclebuilder" -> doc.getMuscleBuilder();
			default -> List.of("정보 없음", "유저타입 정보가 없습니다.");
		};
	}

	private record RiskIngredientData(int score, List<String> message) {}
}
