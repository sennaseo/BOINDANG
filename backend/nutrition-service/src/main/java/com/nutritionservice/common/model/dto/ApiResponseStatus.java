package com.nutritionservice.common.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ApiResponseStatus {
    // ✅ 공통
    SUCCESS(true, HttpStatus.OK, 200, "요청에 성공하였습니다."),
    BAD_REQUEST(false, HttpStatus.BAD_REQUEST, 400, "입력값을 확인해주세요."),
    UNAUTHORIZED(false, HttpStatus.UNAUTHORIZED, 401, "인증이 필요합니다."),
    FORBIDDEN(false, HttpStatus.FORBIDDEN, 403, "권한이 없습니다."),
    NOT_FOUND(false, HttpStatus.NOT_FOUND, 404, "대상을 찾을 수 없습니다."),
    INVALID_JSON(false, HttpStatus.BAD_REQUEST, 400, "요청 본문(JSON)이 올바른 형식이 아닙니다."),
    MISSING_REQUEST_PARAMETER(false, HttpStatus.BAD_REQUEST, 4001, "요청 파라미터가 누락되었습니다."),


    // ✅ 비즈니스 예외
    // users
    EMAIL_DUPLICATE(false, HttpStatus.CONFLICT, 400, "중복된 이메일입니다."),
    PASSWORD_INVALID(false, HttpStatus.BAD_REQUEST, 400, "비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."),
    PASSWORD_MISMATCH(false, HttpStatus.BAD_REQUEST, 400, "비밀번호가 일치하지 않습니다."),
    LOGIN_ERROR(false, HttpStatus.BAD_REQUEST, 500, "로그인 과정 중 서버 오류가 생겼습니다."),
    MEMBER_NOT_FOUND(false, HttpStatus.NOT_FOUND, 404, "해당 사용자가 존재하지 않습니다."),
    TOKEN_EXPIRED(false, HttpStatus.UNAUTHORIZED, 401, "로그인 세션이 만료되었습니다. 다시 로그인해주세요."),
    INVALID_ROLE(false, HttpStatus.FORBIDDEN, 403, "허용되지 않은 기능입니다."),

    // file
    FILE_SAVE_FAILED(false, HttpStatus.INTERNAL_SERVER_ERROR, 5001,"파일 저장에 실패했습니다."),
    FILE_DELETE_FAILED(false, HttpStatus.INTERNAL_SERVER_ERROR, 5002,"파일 삭제에 실패했습니다."),

    // 몽고디비
    MONGODB_DATA_NOT_FOUND(false, HttpStatus.NOT_FOUND, 404, "해당 제품의 정보를 찾을 수 없습니다."),
    MONGODB_SAVE_FAILED(false, HttpStatus.INTERNAL_SERVER_ERROR, 5003, "MongoDB 저장에 실패했습니다."),


    // 백과사전
    ENCYCLOPEDIA_CALL_FAILED(false, HttpStatus.INTERNAL_SERVER_ERROR, 5101, "백과사전 API 호출에 실패했습니다."),
    ENCYCLOPEDIA_RESPONSE_NULL(false, HttpStatus.INTERNAL_SERVER_ERROR, 5102, "백과사전 응답이 null입니다."),
    ENCYCLOPEDIA_INGREDIENT_EMPTY(false, HttpStatus.NO_CONTENT, 5103, "백과사전 성분 상세정보가 없습니다."),
    ENCYCLOPEDIA_TOP_RISK_EMPTY(false, HttpStatus.NO_CONTENT, 5104, "우선순위 위험 성분 정보가 없습니다."),

    ;

    private final boolean isSuccess;
    @JsonIgnore
    private final HttpStatus httpStatus;
    private final int code;
    private final String message;

    ApiResponseStatus(boolean isSuccess, HttpStatus httpStatus, int code, String message) {
        this.isSuccess = isSuccess;
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}
