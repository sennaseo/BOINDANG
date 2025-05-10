package com.boindanguser.common.logger;

public class ExceptionLogFormatter {

    public static String format(
            String requestId,
            String layer,
            String methodName,
            Exception e
    ) {
        StackTraceElement first = e.getStackTrace()[0];

        return String.format(
                "\n\n ─────────────────────────────────────────────── ⚠️ [예외 발생] " +
                        "\n⏳ 요청 ID: [%s]" +
                        "\n📌 실행 위치: [%s] %s" +
                        "\n🚨 예외 메시지: %s" +
                        "\n❗ 예외 클래스: %s" +
                        "\n🛠️ 예외 발생 클래스: %s" +
                        "\n📂 발생 위치: %s:%d" +
                        "\n────────────────────────────────────────────────────────────\n",
                requestId,
                layer, methodName,
                e.getMessage(),
                e.getClass().getName(),
                first.getClassName(),
                first.getFileName(), first.getLineNumber()
        );
    }
}
