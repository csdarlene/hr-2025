// CategoryScoreResponse.java
package com.qualogy.hr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryScoreResponse {
    private Long id;
    private String categoryName;
    private String description;
    private Double score;
    private String comments;
    private Map<String, Double> criteriaScores;
}