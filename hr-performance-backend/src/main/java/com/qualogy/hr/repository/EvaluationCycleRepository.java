package com.qualogy.hr.repository;

import com.qualogy.hr.model.EvaluationCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationCycleRepository extends JpaRepository<EvaluationCycle, Long> {
    
    Optional<EvaluationCycle> findByName(String name);
    
    List<EvaluationCycle> findByActive(boolean active);
    
    @Query("SELECT ec FROM EvaluationCycle ec WHERE :date BETWEEN ec.startDate AND ec.endDate")
    Optional<EvaluationCycle> findCurrentCycle(@Param("date") LocalDate date);
    
    @Query("SELECT ec FROM EvaluationCycle ec WHERE " +
           "(:startDate BETWEEN ec.startDate AND ec.endDate) OR " +
           "(:endDate BETWEEN ec.startDate AND ec.endDate) OR " +
           "(ec.startDate BETWEEN :startDate AND :endDate) OR " +
           "(ec.endDate BETWEEN :startDate AND :endDate)")
    List<EvaluationCycle> findOverlappingCycles(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT ec FROM EvaluationCycle ec WHERE " +
           "ec.id <> :excludeId AND (" +
           "(:startDate BETWEEN ec.startDate AND ec.endDate) OR " +
           "(:endDate BETWEEN ec.startDate AND ec.endDate) OR " +
           "(ec.startDate BETWEEN :startDate AND :endDate) OR " +
           "(ec.endDate BETWEEN :startDate AND :endDate))")
    List<EvaluationCycle> findOtherOverlappingCycles(
        @Param("excludeId") Long excludeId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT ec FROM EvaluationCycle ec WHERE " +
           "ec.selfEvalDueDate BETWEEN :startDate AND :endDate OR " +
           "ec.managerEvalDueDate BETWEEN :startDate AND :endDate OR " +
           "ec.hrReviewDueDate BETWEEN :startDate AND :endDate")
    List<EvaluationCycle> findCyclesWithDueDatesInRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
