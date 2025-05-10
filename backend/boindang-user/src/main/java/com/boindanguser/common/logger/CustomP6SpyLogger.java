package com.boindanguser.common.logger;

import com.p6spy.engine.spy.appender.MessageFormattingStrategy;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CustomP6SpyLogger implements MessageFormattingStrategy {

    private static final String SQL_LOG_SEPARATOR = "────────────────────── 🐬 SQL 실행 %s ────────────────────────";
    private static final String SQL_LOG_ICON = "";

    @Override
    public String formatMessage(int connectionId, String now, long elapsed, String category,
                                String prepared, String sql, String url) {
        if (sql == null || sql.trim().isEmpty()) {
            return "";
        }

        // ✅ 실행 시간 포맷팅
        String currentTime = new SimpleDateFormat("📅 yyyy-MM-dd HH:mm:ss").format(new Date());

        // ✅ SQL 실행 시작/종료 구분 추가
        return String.format(
                "%n%n" + SQL_LOG_SEPARATOR +
                        "%n%s%s | ⌛ 실행시간: %dms | 🔗 Connection ID: %d" +
                        "%s%n" + SQL_LOG_SEPARATOR + "%n",
                "시작", SQL_LOG_ICON, currentTime, elapsed, connectionId, formatSQL(sql), "종료"
        );
    }

    /**
     * ✅ SQL을 보기 좋게 정리하는 메서드
     */
    private String formatSQL(String sql) {
        // 줄바꿈 제거
        sql = sql.replaceAll("[\\n\\r]", " ");

        // 공백 정리
        sql = sql.replaceAll("\\s+", " ");

        // ✅ SET 절 포맷팅
        Pattern setPattern = Pattern.compile("(?i)(set )(.*?)( where\\$)");
        Matcher setMatcher = setPattern.matcher(sql);
        StringBuffer setBuffer = new StringBuffer();
        while (setMatcher.find()) {
            String setClause = setMatcher.group(2).trim();
            String formattedSet = "\n      " + setClause.replaceAll(",", ",\n      ");
            setMatcher.appendReplacement(setBuffer, setMatcher.group(1) + formattedSet + setMatcher.group(3));
        }
        setMatcher.appendTail(setBuffer);
        sql = setBuffer.toString();

        // ✅ SELECT 절 포맷팅
        Pattern selectPattern = Pattern.compile("(?i)(select )(.*?)( from )");
        Matcher selectMatcher = selectPattern.matcher(sql);
        StringBuffer selectBuffer = new StringBuffer();
        while (selectMatcher.find()) {
            String columnList = selectMatcher.group(2).trim();
            String formattedColumns = "\n      " + columnList.replaceAll(",", ",\n      ");
            selectMatcher.appendReplacement(selectBuffer, selectMatcher.group(1) + formattedColumns + selectMatcher.group(3));
        }
        selectMatcher.appendTail(selectBuffer);
        sql = selectBuffer.toString();

        // ✅ 키워드 정렬
        sql = sql
                .replaceAll("(?i)\\bselect\\b", "\n🔹 SELECT")
                .replaceAll("(?i)\\bfrom\\b", "\n  🔹 FROM")
                .replaceAll("(?i)\\bwhere\\b", "\n  🔹 WHERE")
                .replaceAll("(?i)\\binsert into\\b", "\n🔹 INSERT INTO")
                .replaceAll("(?i)\\bvalues\\b", "\n  🔹 VALUES")
                .replaceAll("(?i)\\bupdate\\b", "\n🔹 UPDATE")
                .replaceAll("(?i)\\bdelete from\\b", "\n🔹 DELETE FROM");

        return sql;
    }


}
