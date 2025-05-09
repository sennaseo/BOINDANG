package com.boindang.quiz.domain;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Quiz {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String title;

	private String question;

	private String answer;  // 정답은 서버 내부에서만 사용

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "quiz_option", joinColumns = @JoinColumn(name = "quiz_id"))
	private List<QuizOption> options = new ArrayList<>();

	public Quiz(String title, String question, String answer, List<QuizOption> options) {
		this.title = title;
		this.question = question;
		this.answer = answer;
		this.options = options;
	}

	public boolean isCorrect(String userInput) {
		return answer.equalsIgnoreCase(userInput);
	}
}

