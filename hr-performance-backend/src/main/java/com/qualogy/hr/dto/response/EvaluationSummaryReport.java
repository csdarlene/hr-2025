// EvaluationSummaryReport.java
package com.qualogy.hr.dto.response;

import com.qualogy.hr.model.enums.Department;
import com.qualogy.hr.model.enums.SkillLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationSummaryReport {
    private Long totalEvaluations;
    private Long completedEvaluations;
    private Long pendingEvaluations;
    private Double averageScore;
    private Map<Department, DepartmentSummary> departmentSummaries;
    private Map<SkillLevel, SkillLevelSummary> skillLevelSummaries;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentSummary {
        private Long totalEmployees;
        private Long completedEvaluations;
        private Double averageScore;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillLevelSummary {
        private Long totalEmployees;
        private Long completedEvaluations;
        private Double averageScore;
    }
}

