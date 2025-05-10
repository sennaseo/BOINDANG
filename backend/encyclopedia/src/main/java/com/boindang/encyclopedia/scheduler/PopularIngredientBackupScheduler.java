package com.boindang.encyclopedia.scheduler;

import com.boindang.encyclopedia.application.PopularIngredientBackupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class PopularIngredientBackupScheduler {

    private final PopularIngredientBackupService backupService;

    // 매일 자정 실행 (cron: 초 분 시 일 월 요일)
    @Scheduled(cron = "0 0 0 * * *")
    public void backupPopularIngredients() {
        log.info("🔁 자정 백업 작업 시작");
        backupService.backupAndClear();
    }
}
