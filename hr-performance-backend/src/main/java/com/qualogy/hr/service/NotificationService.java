// NotificationService.java
package com.qualogy.hr.service;

import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.EvaluationType;
import com.qualogy.hr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private EvaluationService evaluationService;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEvaluationAssignedNotification(Evaluation evaluation) {
        try {
            User employee = evaluation.getEmployee();
            Map<String, Object> variables = new HashMap<>();
            variables.put("employeeName", employee.getFullName());
            variables.put("evaluationPeriod", evaluation.getEvaluationPeriod());
            variables.put("dueDate", formatDate(evaluation.getDueDate()));
            variables.put("evaluationUrl", buildEvaluationUrl(evaluation.getId()));

            emailService.sendHtmlMessage(
                employee.getEmail(),
                "New Evaluation Assigned",
                "emails/evaluation-assigned",
                variables
            );
        } catch (Exception e) {
            // Log the error
            System.err.println("Failed to send evaluation assigned notification: " + e.getMessage());
        }
    }

    public void sendEvaluationReminder(Evaluation evaluation) {
        try {
            User evaluator = evaluation.getEvaluator();
            User employee = evaluation.getEmployee();
            
            Map<String, Object> variables = new HashMap<>();
            variables.put("recipientName", evaluator.getFullName());
            variables.put("employeeName", employee.getFullName());
            variables.put("evaluationPeriod", evaluation.getEvaluationPeriod());
            variables.put("dueDate", formatDate(evaluation.getDueDate()));
            variables.put("evaluationUrl", buildEvaluationUrl(evaluation.getId()));

            emailService.sendHtmlMessage(
                evaluator.getEmail(),
                "Reminder: Pending Evaluation",
                "emails/evaluation-reminder",
                variables
            );
        } catch (Exception e) {
            // Log the error
            System.err.println("Failed to send evaluation reminder: " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 9 * * MON-FRI") // Run at 9 AM on weekdays
    public void sendDailyReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Evaluation> dueEvaluations = evaluationService.getEvaluationsDueOn(tomorrow);
        
        for (Evaluation evaluation : dueEvaluations) {
            if (!evaluation.isFinalized()) {
                sendEvaluationReminder(evaluation);
            }
        }
    }

    private String formatDate(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
    }

    private String buildEvaluationUrl(Long evaluationId) {
        return String.format("%s/evaluations/%d", frontendUrl, evaluationId);
    }
}