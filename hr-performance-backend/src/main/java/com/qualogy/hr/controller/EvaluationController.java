// EvaluationController.java
package com.qualogy.hr.controller;

import com.qualogy.hr.dto.request.EvaluationRequest;
import com.qualogy.hr.dto.response.EvaluationResponse;
import com.qualogy.hr.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public List<EvaluationResponse> getAllEvaluations() {
        return evaluationService.getAllEvaluations();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isEvaluationAccessible(#id, authentication)")
    public EvaluationResponse getEvaluationById(@PathVariable Long id) {
        return evaluationService.getEvaluationById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public EvaluationResponse createEvaluation(@Valid @RequestBody EvaluationRequest evaluationRequest) {
        return evaluationService.createEvaluation(evaluationRequest);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isEvaluationEditable(#id, authentication)")
    public EvaluationResponse updateEvaluation(
            @PathVariable Long id,
            @Valid @RequestBody EvaluationRequest evaluationRequest) {
        return evaluationService.updateEvaluation(id, evaluationRequest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public ResponseEntity<?> deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isEvaluationEditable(#id, authentication)")
    public EvaluationResponse submitEvaluation(@PathVariable Long id) {
        return evaluationService.submitEvaluation(id);
    }

    @PostMapping("/{id}/finalize")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public EvaluationResponse finalizeEvaluation(@PathVariable Long id) {
        return evaluationService.finalizeEvaluation(id);
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isSelfOrManager(#employeeId, authentication)")
    public List<EvaluationResponse> getEmployeeEvaluations(@PathVariable Long employeeId) {
        return evaluationService.getEmployeeEvaluations(employeeId);
    }

    @GetMapping("/evaluator/{evaluatorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isSelfOrManager(#evaluatorId, authentication)")
    public List<EvaluationResponse> getEvaluatorEvaluations(@PathVariable Long evaluatorId) {
        return evaluationService.getEvaluatorEvaluations(evaluatorId);
    }

    @GetMapping("/pending/{evaluatorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isSelfOrManager(#evaluatorId, authentication)")
    public List<EvaluationResponse> getPendingEvaluations(@PathVariable Long evaluatorId) {
        return evaluationService.getPendingEvaluations(evaluatorId);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public List<EvaluationResponse> getOverdueEvaluations() {
        return evaluationService.getOverdueEvaluations();
    }
}