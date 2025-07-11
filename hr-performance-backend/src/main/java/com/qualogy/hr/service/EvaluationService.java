// EvaluationService.java
package com.qualogy.hr.service;

import com.qualogy.hr.dto.request.EvaluationRequest;
import com.qualogy.hr.dto.response.EvaluationResponse;
import com.qualogy.hr.exception.ResourceNotFoundException;
import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.EvaluationStatus;
import com.qualogy.hr.model.enums.EvaluationType;
import com.qualogy.hr.repository.EvaluationRepository;
import com.qualogy.hr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EvaluationMapper evaluationMapper;

    @Transactional(readOnly = true)
    public List<EvaluationResponse> getAllEvaluations() {
        return evaluationRepository.findAll().stream()
                .map(evaluationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EvaluationResponse getEvaluationById(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));
        return evaluationMapper.toDto(evaluation);
    }

    @Auditable
    @Transactional
    public EvaluationResponse createEvaluation(EvaluationRequest evaluationRequest) {
        User employee = userRepository.findById(evaluationRequest.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + evaluationRequest.getEmployeeId()));
        
        User evaluator = userRepository.findById(evaluationRequest.getEvaluatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Evaluator not found with id: " + evaluationRequest.getEvaluatorId()));

        // Check if evaluation already exists for this employee, type, and cycle
        if (evaluationRequest.getEvaluationCycleId() != null &&
            evaluationRepository.existsByEmployeeIdAndTypeAndEvaluationCycleId(
                evaluationRequest.getEmployeeId(),
                evaluationRequest.getType(),
                evaluationRequest.getEvaluationCycleId())) {
            throw new IllegalStateException("Evaluation of type " + evaluationRequest.getType() + 
                " already exists for this employee in the specified cycle");
        }

        Evaluation evaluation = evaluationMapper.toEntity(evaluationRequest);
        evaluation.setEmployee(employee);
        evaluation.setEvaluator(evaluator);
        evaluation.setStatus(EvaluationStatus.DRAFT);

        Evaluation savedEvaluation = evaluationRepository.save(evaluation);
        notificationService.sendEvaluationAssignedNotification(savedEvaluation);
        auditLogService.log("CREATE", "EVALUATION", savedEvaluation.getId(), 
        null, savedEvaluation.toString());
        return evaluationMapper.toDto(savedEvaluation);
    }

    @Auditable
    @Transactional
    public EvaluationResponse updateEvaluation(Long id, EvaluationRequest evaluationRequest) {
        Evaluation existingEvaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));

        // Prevent updates to finalized evaluations
        if (existingEvaluation.isFinalized()) {
            throw new IllegalStateException("Cannot update a finalized evaluation");
        }

        // Update fields
        existingEvaluation.setType(evaluationRequest.getType());
        existingEvaluation.setEvaluationPeriod(evaluationRequest.getEvaluationPeriod());
        existingEvaluation.setDueDate(evaluationRequest.getDueDate());
        existingEvaluation.setComments(evaluationRequest.getComments());
        existingEvaluation.setStrengths(evaluationRequest.getStrengths());
        existingEvaluation.setAreasForImprovement(evaluationRequest.getAreasForImprovement());

        // Update employee if changed
        if (!existingEvaluation.getEmployee().getId().equals(evaluationRequest.getEmployeeId())) {
            User newEmployee = userRepository.findById(evaluationRequest.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + evaluationRequest.getEmployeeId()));
            existingEvaluation.setEmployee(newEmployee);
        }

        // Update evaluator if changed
        if (!existingEvaluation.getEvaluator().getId().equals(evaluationRequest.getEvaluatorId())) {
            User newEvaluator = userRepository.findById(evaluationRequest.getEvaluatorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Evaluator not found with id: " + evaluationRequest.getEvaluatorId()));
            existingEvaluation.setEvaluator(newEvaluator);
        }

        Evaluation updatedEvaluation = evaluationRepository.save(existingEvaluation);
        auditLogService.log("UPDATE", "EVALUATION", id, 
        existingEvaluation.toString(), updatedEvaluation.toString());
return evaluationMapper.toDto(updatedEvaluation);
    }

    @Auditable
    @Transactional
    public void deleteEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));
        
        if (evaluation.isFinalized()) {
            throw new IllegalStateException("Cannot delete a finalized evaluation");
        }
        auditLogService.log("DELETE", "EVALUATION", id, 
        evaluation.toString(), null);
        evaluationRepository.delete(evaluation);
    }

    @Transactional
    public EvaluationResponse submitEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));

        if (evaluation.isFinalized()) {
            throw new IllegalStateException("Evaluation is already finalized");
        }

        evaluation.setStatus(EvaluationStatus.SUBMITTED);
        Evaluation updatedEvaluation = evaluationRepository.save(evaluation);
        return evaluationMapper.toDto(updatedEvaluation);
    }

    @Transactional
    public EvaluationResponse finalizeEvaluation(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + id));

        if (evaluation.isFinalized()) {
            throw new IllegalStateException("Evaluation is already finalized");
        }

        evaluation.finalizeEvaluation();
        Evaluation updatedEvaluation = evaluationRepository.save(evaluation);
        return evaluationMapper.toDto(updatedEvaluation);
    }

    @Transactional(readOnly = true)
    public List<EvaluationResponse> getEmployeeEvaluations(Long employeeId) {
        if (!userRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
        }
        
        return evaluationRepository.findByEmployeeId(employeeId).stream()
                .map(evaluationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EvaluationResponse> getEvaluatorEvaluations(Long evaluatorId) {
        if (!userRepository.existsById(evaluatorId)) {
            throw new ResourceNotFoundException("Evaluator not found with id: " + evaluatorId);
        }
        
        return evaluationRepository.findByEvaluatorId(evaluatorId).stream()
                .map(evaluationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EvaluationResponse> getPendingEvaluations(Long evaluatorId) {
        if (!userRepository.existsById(evaluatorId)) {
            throw new ResourceNotFoundException("Evaluator not found with id: " + evaluatorId);
        }
        
        return evaluationRepository.findPendingEvaluationsForEvaluator(evaluatorId, EvaluationStatus.SUBMITTED).stream()
                .map(evaluationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EvaluationResponse> getOverdueEvaluations() {
        return evaluationRepository.findOverdueEvaluations(LocalDate.now()).stream()
                .map(evaluationMapper::toDto)
                .collect(Collectors.toList());
    }
}