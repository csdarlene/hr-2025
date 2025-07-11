// ScheduledTasks.java
package com.qualogy.hr.scheduler;

import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.repository.EvaluationRepository;
import com.qualogy.hr.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class ScheduledTasks {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private NotificationService notificationService;

    // Run every day at 9 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendEvaluationReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Evaluation> dueEvaluations = evaluationRepository.findByDueDateAndStatusNot(
            tomorrow, EvaluationStatus.COMPLETED);
        
        dueEvaluations.forEach(evaluation -> {
            notificationService.sendEvaluationReminder(evaluation);
        });
    }

    // Run on the first day of each month
    @Scheduled(cron = "0 0 9 1 * ?")
    public void generateMonthlyReports() {
        LocalDate startDate = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        // Generate and save reports for last month
        // This is a placeholder - implement report generation logic
    }

    // Run every Sunday at midnight
    @Scheduled(cron = "0 0 0 ? * SUN")
    public void cleanupOldFiles() {
        // Clean up temporary files or old uploads
        // This is a placeholder - implement cleanup logic
    }
}