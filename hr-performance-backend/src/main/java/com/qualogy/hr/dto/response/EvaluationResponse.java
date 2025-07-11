// EvaluationResponse.java
package com.qualogy.hr.dto.response;

import com.qualogy.hr.model.enums.EvaluationStatus;
import com.qualogy.hr.model.enums.EvaluationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long evaluatorId;
    private String evaluatorName;
    private EvaluationType type;
    private EvaluationStatus status;
    private String evaluationPeriod;
    private LocalDate dueDate;
    private List<CategoryScoreResponse> categoryScores;
    private String comments;
    private String strengths;
    private String areasForImprovement;
    private boolean isFinalized;
    private LocalDate finalizedAt;
    private Long evaluationCycleId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



