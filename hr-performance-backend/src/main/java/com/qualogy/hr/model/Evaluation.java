package com.qualogy.hr.model;

import com.qualogy.hr.model.enums.EvaluationStatus;
import com.qualogy.hr.model.enums.EvaluationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EvaluationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EvaluationStatus status = EvaluationStatus.DRAFT;

    @Column(name = "evaluation_period")
    private String evaluationPeriod;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CategoryScore> categoryScores = new HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String areasForImprovement;

    @Column(name = "is_finalized", nullable = false)
    private boolean isFinalized = false;

    @Column(name = "finalized_at")
    private LocalDate finalizedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_cycle_id")
    private EvaluationCycle evaluationCycle;

    public void addCategoryScore(CategoryScore score) {
        categoryScores.add(score);
        score.setEvaluation(this);
    }

    public void removeCategoryScore(CategoryScore score) {
        categoryScores.remove(score);
        score.setEvaluation(null);
    }

    public void finalizeEvaluation() {
        this.status = EvaluationStatus.COMPLETED;
        this.isFinalized = true;
        this.finalizedAt = LocalDate.now();
    }
}
