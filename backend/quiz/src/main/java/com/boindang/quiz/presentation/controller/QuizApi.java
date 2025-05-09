package com.boindang.quiz.presentation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.boindang.quiz.common.response.BaseResponse;
import com.boindang.quiz.presentation.dto.QuizResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "영양퀴즈", description = "영양퀴즈 관련 API입니다.")
@RequestMapping("/quiz")
public interface QuizApi {

	@Operation(summary = "퀴즈 5문제 출제", description = "사용자가 아직 풀지 않은 퀴즈 중 무작위로 5문제를 출제합니다.")
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "퀴즈 5문제 출제가 완료되었습니다.",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(name = "퀴즈 응답 예시", value = """
                {
                  "isSuccess": true,
                  "code": 200,
                  "message": "퀴즈 5문제 출제가 완료되었습니다.",
                  "data": [
                    {
                      "quizId": 1,
                      "title": "숨겨진 혈당 스파이커?",
                      "question": "제품 성분표에 '당류 0g'이라고 표시되어 있어도, 실제로는 설탕보다 혈당을 더 빠르고 높게 올릴 수 있는 성분은 무엇일까요?",
                      "options": [
                        "알룰로스 (Allulose)",
                        "스테비아 (Stevia)",
                        "말토덱스트린 (Maltodextrin)",
                        "자일리톨 (Xylitol)"
                      ]
                    },
                    {
                      "quizId": 2,
                      "title": "GI 지수가 낮은 감미료는?",
                      "question": "다음 감미료 중 혈당 지수(GI)가 가장 낮은 감미료는?",
                      "options": [
                        "과당",
                        "설탕",
                        "에리스리톨",
                        "글루코스 시럽"
                      ]
                    }
                  ]
                }
                """)
			)
		),
		@ApiResponse(
			responseCode = "500",
			description = "서버 오류가 발생하였습니다.",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(name = "서버 오류 응답", value = """
                {
                  "isSuccess": false,
                  "code": 500,
                  "message": "서버 오류가 발생하였습니다.",
                  "data": null
                }
                """)
			)
		)
	})
	@GetMapping
	BaseResponse<List<QuizResponse>> getBatchQuiz(
		@Parameter(description = "사용자 ID", required = true, example = "1")
		@RequestParam Long userId
	);
}
