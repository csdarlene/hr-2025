// EvaluationCycleRequest.java
package com.qualogy.hr.dto.request;

import com.qualogy.hr.model.enums.Department;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EvaluationCycleRequest {
    @NotBlank
    private String name;
    
    @NotNull
    private LocalDate startDate;
    
    @NotNull
    private LocalDate endDate;
    
    private LocalDate selfEvalDueDate;
    private LocalDate managerEvalDueDate;
    private LocalDate hrReviewDueDate;
    private String description;
    private boolean active = true;
}