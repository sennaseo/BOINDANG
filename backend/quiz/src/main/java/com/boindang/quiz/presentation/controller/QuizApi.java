package com.boindang.quiz.presentation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.boindang.quiz.common.response.BaseResponse;
import com.boindang.quiz.presentation.dto.request.AnswerRequest;
import com.boindang.quiz.presentation.dto.response.QuizAnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizResponse;
import com.boindang.quiz.presentation.dto.response.QuizStatisticsResponse;
import com.boindang.quiz.presentation.dto.response.WrongAnswerResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "영양퀴즈", description = "영양퀴즈 관련 API입니다.")
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

	@Operation(summary = "퀴즈 정답 제출", description = "사용자가 선택한 보기와 퀴즈 ID를 전달하면 정답 여부와 해설을 반환합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정답 제출 결과 반환이 완료되었습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
				{
				  "isSuccess": true,
				  "code": 200,
				  "message": "정답 제출 완료",
				  "data": {
					"isCorrect": false,
					"explanation": "말티톨은 당알코올이지만 GI가 높아 혈당을 크게 올릴 수 있습니다."
				  }
				}
				""")
			)
		),
		@ApiResponse(responseCode = "404", description = "해당 퀴즈를 찾을 수 없음",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
				{
				  "isSuccess": false,
				  "code": 404,
				  "message": "해당 퀴즈를 찾을 수 없습니다.",
				  "data": null
				}
				""")
			)
		)
	})
	@PostMapping("/submit")
	BaseResponse<QuizAnswerResponse> submitAnswer(
		@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "정답 제출 형식",
			required = true,
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
				{
				  "userId": 1,
				  "quizId": 3,
				  "selectedOptionId": 1
				}
				""")
			)
		)
		@RequestBody AnswerRequest request
	);

	@Operation(summary = "오답노트 조회", description = "사용자의 퀴즈 풀이 이력 중 오답만 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "오답노트 조회에 성공하였습니다.",
			content = @Content(mediaType = "application/json",
				schema = @Schema(implementation = WrongAnswerResponse.class),
				examples = @ExampleObject(value = """
                {
                  "isSuccess": true,
                  "code": 200,
                  "message": "오답노트 조회에 성공하였습니다.",
                  "data": [
                    {
                      "quizId": 12,
                      "question": "GI가 높은 감미료는 무엇인가요?",
                      "options": ["에리스리톨", "자일리톨", "말티톨", "스테비아"],
                      "answerId": 2,
                      "selectedId": 1,
                      "explanation": "말티톨은 GI 수치가 높은 편으로, 당뇨환자에게 주의가 필요합니다.",
                      "selectedExplanation": "자일리톨은 비교적 낮은 GI를 가지고 있어 정답이 아닙니다."
                    }
                  ]
                }
            """))
		),
		@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
                  "isSuccess": false,
                  "code": 401,
                  "message": "로그인이 필요합니다.",
                  "data": null
                }
            """))
		)
	})
	@GetMapping("/wrong-answers")
	BaseResponse<List<WrongAnswerResponse>> getWrongAnswers(
		@Parameter(description = "사용자 ID", required = true)
		@RequestParam Long userId
	);

	@Operation(summary = "퀴즈 통계 조회", description = "총 풀이 수, 정답/오답 수, 정확도(%)를 반환합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "퀴즈 통계 조회에 성공하였습니다.",
			content = @Content(examples = @ExampleObject(value = """
            {
              "isSuccess": true,
              "code": 200,
              "message": "퀴즈 통계 조회에 성공하였습니다.",
              "data": {
                "totalSolved": 42,
                "correctCount": 31,
                "wrongCount": 11,
                "accuracy": 73.8
              }
            }
        """))),
		@ApiResponse(responseCode = "401", description = "로그인이 필요한 서비스입니다.",
			content = @Content(examples = @ExampleObject(value = """
            {
              "isSuccess": false,
              "code": 401,
              "message": "로그인이 필요한 서비스입니다.",
              "data": null
            }
        """)))
	})
	@GetMapping("/statistics")
	BaseResponse<QuizStatisticsResponse> getStatistics(
		@Parameter(description = "사용자 ID", required = true)
		@RequestParam Long userId
	);
}
