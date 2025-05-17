package com.boindang.quiz.presentation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.boindang.quiz.common.response.ApiResponses;
import com.boindang.quiz.presentation.dto.request.AnswerRequest;
import com.boindang.quiz.presentation.dto.response.QuizAnswerResponse;
import com.boindang.quiz.presentation.dto.response.QuizResponse;
import com.boindang.quiz.presentation.dto.response.QuizStatisticsResponse;
import com.boindang.quiz.presentation.dto.response.AnswerResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "영양퀴즈", description = "영양퀴즈 관련 API입니다.")
public interface QuizApi {

	@Operation(summary = "퀴즈 5문제 출제", description = "사용자가 아직 풀지 않은 퀴즈 중 무작위로 5문제를 출제합니다.")
	@io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "퀴즈 5문제 출제가 완료되었습니다.",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					   "data": [
					     {
					       "quizId": 4,
					       "title": "헬스장 단백질바의 배신",
					       "question": "다이어트용 단백질바에 자주 들어가는, GI 지수가 높은 감미료는?",
					       "options": [
					         "말토덱스트린",
					         "스테비아",
					         "이눌린",
					         "소르비톨"
					       ]
					     },
					     {
					       "quizId": 5,
					       "title": "소금보다 더 짠 친구?",
					       "question": "식품에 가장 많이 숨겨져 있는 나트륨 함유 원료는?",
					       "options": [
					         "정제소금",
					         "MSG",
					         "탄산수소나트륨",
					         "정제수"
					       ]
					     },
					     {
					       "quizId": 17,
					       "title": "샐러드 드레싱, 괜찮을까?",
					       "question": "샐러드 드레싱 중 가장 당 함량이 높은 것은?",
					       "options": [
					         "발사믹 드레싱",
					         "요거트 드레싱",
					         "참깨 드레싱",
					         "시저 드레싱"
					       ]
					     },
					     {
					       "quizId": 21,
					       "title": "건강 음료의 실체",
					       "question": "건강 음료로 알려진 제품 중 실제 당 함량이 높은 것은?",
					       "options": [
					         "녹차 라떼",
					         "비타민 워터",
					         "무가당 코코넛워터",
					         "프로틴 워터"
					       ]
					     },
					     {
					       "quizId": 26,
					       "title": "과일주스는 항상 건강하다?",
					       "question": "과일주스는 천연이라서 혈당을 거의 올리지 않는다.",
					       "options": [
					         "O",
					         "X"
					       ]
					     }
					   ],
					   "error": null,
					   "success": true
					 }
                """)
			)
		),
		@ApiResponse(responseCode = "401", description = "유효하지 않은 사용자입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
					      "data": null,
					      "error": {
					        "status": "UNAUTHORIZED",
					        "message": "유효하지 않은 사용자입니다."
					      },
					      "success": false
					    }
            """))
		)
	})
	@GetMapping
	ApiResponses<List<QuizResponse>> getBatchQuiz(
		@Parameter(description = "사용자 ID", required = true, example = "1")
		@RequestHeader("X-User-Id") String userId
	);

	@Operation(summary = "퀴즈 정답 제출", description = "사용자가 선택한 보기와 퀴즈 ID를 전달하면 정답 여부와 해설을 반환합니다.")
	@io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정답 제출 결과 반환이 완료되었습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					   "data": {
					     "isCorrect": true,
					     "answer": 1,
					     "explanation": "천연당이라 해도 혈당 급상승을 유발."
					   },
					   "error": null,
					   "success": true
					 }
				""")
			)
		),
		@ApiResponse(responseCode = "404", description = "해당 퀴즈를 찾을 수 없습니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					   "data": null,
					   "error": {
					     "status": "NOT_FOUND",
					     "message": "해당 퀴즈를 찾을 수 없습니다."
					   },
					   "success": false
					 }
				""")
			)
		)
	})
	@PostMapping("/submit")
	ApiResponses<QuizAnswerResponse> submitAnswer(
		@Parameter(description = "사용자 ID", required = true, example = "1")
		@RequestHeader("X-User-Id") String userId,

		@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "정답 제출 형식",
			required = true,
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
				{
				  "quizId": 3,
				  "selectedOptionId": 1
				}
				""")
			)
		)
		@RequestBody AnswerRequest request
	);

	@Operation(summary = "오답노트 조회", description = "사용자의 퀴즈 풀이 이력 중 오답만 조회합니다.")
	@io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "오답노트 조회에 성공하였습니다.",
			content = @Content(mediaType = "application/json",
				schema = @Schema(implementation = AnswerResponse.class),
				examples = @ExampleObject(value = """
                {
					       "data": [
					         {
					           "quizId": 1,
					           "question": "무설탕 젤리라고 광고하지만 실제로 혈당을 크게 올릴 수 있는 감미료는?",
					           "options": [
					             "에리스리톨",
					             "스테비아",
					             "말티톨",
					             "수크랄로스"
					           ],
					           "isCorrect": false,
					           "answerId": 3,
					           "selectedId": 1,
					           "explanation": "혈당을 올리는 대표적인 당알코올로 주의 필요.",
					           "selectedExplanation": "혈당에 거의 영향을 주지 않음."
					         },
					         {
					           "quizId": 2,
					           "question": "일반 카페라떼 1잔에 가장 많은 칼로리를 차지하는 것은?",
					           "options": [
					             "에스프레소 샷",
					             "우유",
					             "시럽",
					             "물"
					           ],
					           "isCorrect": false,
					           "answerId": 2,
					           "selectedId": 1,
					           "explanation": "당분과 지방으로 인해 칼로리의 대부분을 차지함.",
					           "selectedExplanation": "거의 칼로리가 없음."
					         },
					         {
					           "quizId": 30,
					           "question": "가공되지 않은 식품은 혈당에 전혀 영향을 미치지 않는다.",
					           "options": [
					             "O",
					             "X"
					           ],
					           "isCorrect": false,
					           "answerId": 2,
					           "selectedId": 1,
					           "explanation": "현미, 감자 등도 가공은 없지만 혈당 지수는 높을 수 있습니다.",
					           "selectedExplanation": "가공되지 않았더라도 고GI 식품이면 혈당을 올릴 수 있습니다."
					         }
					       ],
					       "error": null,
					       "success": true
					     }
            """))
		),
		@ApiResponse(responseCode = "401", description = "유효하지 않은 사용자입니다.",
			content = @Content(mediaType = "application/json",
				examples = @ExampleObject(value = """
                {
					      "data": null,
					      "error": {
					        "status": "UNAUTHORIZED",
					        "message": "유효하지 않은 사용자입니다."
					      },
					      "success": false
					    }
            """))
		)
	})
	@GetMapping("/wrong-answers")
	ApiResponses<List<AnswerResponse>> getWrongAnswers(
		@Parameter(description = "사용자 ID", required = true, example = "1")
		@RequestHeader("X-User-Id") String userId
	);

	@Operation(summary = "퀴즈 통계 조회", description = "총 풀이 수, 정답/오답 수, 정확도(%)를 반환합니다.")
	@io.swagger.v3.oas.annotations.responses.ApiResponses({
		@ApiResponse(responseCode = "200", description = "퀴즈 통계 조회에 성공하였습니다.",
			content = @Content(examples = @ExampleObject(value = """
            {
				      "data": {
				        "totalSolved": 30,
				        "correctCount": 4,
				        "wrongCount": 26,
				        "accuracy": 13.3
				      },
				      "error": null,
				      "success": true
				    }
        """))),
		@ApiResponse(responseCode = "401", description = "유효하지 않은 사용자입니다.",
			content = @Content(examples = @ExampleObject(value = """
            {
				      "data": null,
				      "error": {
				        "status": "UNAUTHORIZED",
				        "message": "유효하지 않은 사용자입니다."
				      },
				      "success": false
				    }
        """)))
	})
	@GetMapping("/statistics")
	ApiResponses<QuizStatisticsResponse> getStatistics(
		@Parameter(description = "사용자 ID", required = true, example = "1")
		@RequestHeader("X-User-Id") String userId
	);
}
