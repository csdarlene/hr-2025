package com.qualogy.hr.repository;

import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.EvaluationStatus;
import com.qualogy.hr.model.enums.EvaluationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    
    List<Evaluation> findByEmployeeId(Long employeeId);
    
    List<Evaluation> findByEvaluatorId(Long evaluatorId);
    
    List<Evaluation> findByEmployeeIdAndType(Long employeeId, EvaluationType type);
    
    List<Evaluation> findByEmployeeIdAndStatus(Long employeeId, EvaluationStatus status);
    
    @Query("SELECT e FROM Evaluation e WHERE e.employee.id = :employeeId AND e.evaluationCycle.id = :cycleId")
    List<Evaluation> findByEmployeeAndCycle(@Param("employeeId") Long employeeId, @Param("cycleId") Long cycleId);
    
    @Query("SELECT e FROM Evaluation e WHERE e.employee.id = :employeeId AND e.type = :type AND e.evaluationCycle.id = :cycleId")
    Optional<Evaluation> findByEmployeeTypeAndCycle(
        @Param("employeeId") Long employeeId, 
        @Param("type") EvaluationType type, 
        @Param("cycleId") Long cycleId
    );
    
    @Query("SELECT e FROM Evaluation e WHERE e.evaluator.id = :evaluatorId AND e.status = :status")
    List<Evaluation> findPendingEvaluationsForEvaluator(
        @Param("evaluatorId") Long evaluatorId, 
        @Param("status") EvaluationStatus status
    );
    
    @Query("SELECT e FROM Evaluation e WHERE e.evaluationCycle.id = :cycleId AND e.status = :status")
    List<Evaluation> findByCycleAndStatus(
        @Param("cycleId") Long cycleId, 
        @Param("status") EvaluationStatus status
    );
    
    @Query("SELECT e FROM Evaluation e WHERE e.evaluationCycle.id = :cycleId AND e.employee.department = :department")
    List<Evaluation> findByCycleAndDepartment(
        @Param("cycleId") Long cycleId, 
        @Param("department") String department
    );
    
    @Query("SELECT e FROM Evaluation e WHERE e.dueDate <= :date AND e.status <> 'COMPLETED'")
    List<Evaluation> findOverdueEvaluations(@Param("date") LocalDate date);
    
    boolean existsByEmployeeIdAndTypeAndEvaluationCycleId(
        Long employeeId, 
        EvaluationType type, 
        Long evaluationCycleId
    );
}
