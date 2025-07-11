// EvaluationRequest.java
package com.qualogy.hr.dto.request;

import com.qualogy.hr.model.enums.EvaluationStatus;
import com.qualogy.hr.model.enums.EvaluationType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class EvaluationRequest {
    @NotNull
    private Long employeeId;
    
    @NotNull
    private Long evaluatorId;
    
    @NotNull
    private EvaluationType type;
    
    private String evaluationPeriod;
    private LocalDate dueDate;
    private List<CategoryScoreRequest> categoryScores;
    private String comments;
    private String strengths;
    private String areasForImprovement;
    private Long evaluationCycleId;
}



