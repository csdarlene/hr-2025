// EmployeePerformanceReport.java
package com.qualogy.hr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeePerformanceReport {
    private Long employeeId;
    private String employeeName;
    private String department;
    private String skillLevel;
    private List<EvaluationScore> evaluationScores;
    private Double averageScore;
    private Integer rankInDepartment;
    private Integer rankInCompany;
    private Map<String, Double> categoryAverages;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvaluationScore {
        private Long evaluationId;
        private String evaluationPeriod;
        private LocalDate evaluationDate;
        private Double totalScore;
        private String evaluatorName;
        private String status;
    }
}