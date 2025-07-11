// 
package com.qualogy.hr.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class CategoryScoreRequest {
    @NotNull
    private String categoryName;
    private String description;
    private Double score;
    private String comments;
    private Map<String, Double> criteriaScores;
}