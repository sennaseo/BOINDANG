package com.boindang.encyclopedia.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.List;

@Document(indexName = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDocument {

	@Id
	private String id;

	private String name;
	private String shortMessage;
	private String keyword;

	private RiskLevel riskLevel;

	private int diabeticScore;
	private int kidneyPatientScore;
	private int dieterScore;
	private int muscleBuilderScore;

	private List<String> diabetic;
	private List<String> kidneyPatient;
	private List<String> dieter;
	private List<String> muscleBuilder;

	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class RiskLevel {
		private String diabetic;
		private String kidneyPatient;
		private String dieter;
		private String muscleBuilder;
	}
}
