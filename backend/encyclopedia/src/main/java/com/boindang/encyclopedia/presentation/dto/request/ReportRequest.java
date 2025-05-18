package com.boindang.encyclopedia.presentation.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {
	private List<String> ingredients;
	private String userType;
}
