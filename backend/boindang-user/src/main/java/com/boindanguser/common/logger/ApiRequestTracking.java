package com.boindanguser.common.logger;

import java.util.UUID;

public class ApiRequestTracking {
    private static final ThreadLocal<String> requestId = new ThreadLocal<>();

    // ✅ 요청 ID 생성 및 저장
    public static void startTracking() {
        requestId.set(UUID.randomUUID().toString().substring(0, 8)); // 8자리 UUID 생성
    }

    // ✅ 요청 ID 가져오기
    public static String getRequestId() {
        return requestId.get();
    }

    // ✅ 요청 ID 제거 (메모리 누수 방지)
    public static void clear() {
        requestId.remove();
    }
}
