package com.qualogy.hr.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "category_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryScore extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private Evaluation evaluation;

    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double score;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @ElementCollection
    @CollectionTable(name = "criteria_scores", 
        joinColumns = @JoinColumn(name = "category_score_id"))
    @MapKeyColumn(name = "criteria_name")
    @Column(name = "score")
    @Builder.Default
    private Map<String, Double> criteriaScores = new HashMap<>();

    public void addCriteriaScore(String criteriaName, Double score) {
        this.criteriaScores.put(criteriaName, score);
        updateOverallScore();
    }

    public void removeCriteriaScore(String criteriaName) {
        this.criteriaScores.remove(criteriaName);
        updateOverallScore();
    }

    private void updateOverallScore() {
        if (criteriaScores.isEmpty()) {
            this.score = 0.0;
            return;
        }
        this.score = criteriaScores.values().stream()
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0);
    }
}
