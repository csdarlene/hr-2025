// EvaluationServiceTest.java
package com.qualogy.hr.service;

import com.qualogy.hr.dto.request.EvaluationRequest;
import com.qualogy.hr.exception.ResourceNotFoundException;
import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.EvaluationStatus;
import com.qualogy.hr.model.enums.EvaluationType;
import com.qualogy.hr.repository.EvaluationRepository;
import com.qualogy.hr.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EvaluationServiceTest {

    @Mock
    private EvaluationRepository evaluationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private EvaluationService evaluationService;

    private User employee;
    private User evaluator;
    private Evaluation evaluation;

    @BeforeEach
    void setUp() {
        employee = new User();
        employee.setId(1L);
        employee.setUsername("employee1");
        
        evaluator = new User();
        evaluator.setId(2L);
        evaluator.setUsername("evaluator1");
        
        evaluation = new Evaluation();
        evaluation.setId(1L);
        evaluation.setEmployee(employee);
        evaluation.setEvaluator(evaluator);
        evaluation.setType(EvaluationType.TEAM_LEAD_EVALUATION);
        evaluation.setStatus(EvaluationStatus.DRAFT);
    }

    @Test
    void createEvaluation_ValidRequest_ReturnsEvaluation() {
        // Arrange
        EvaluationRequest request = new EvaluationRequest();
        request.setEmployeeId(1L);
        request.setEvaluatorId(2L);
        request.setType(EvaluationType.TEAM_LEAD_EVALUATION);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(userRepository.findById(2L)).thenReturn(Optional.of(evaluator));
        when(evaluationRepository.save(any(Evaluation.class))).thenReturn(evaluation);
        
        // Act
        var result = evaluationService.createEvaluation(request);
        
        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(notificationService).sendEvaluationAssignedNotification(any(Evaluation.class));
    }

    @Test
    void getEvaluationById_ExistingId_ReturnsEvaluation() {
        // Arrange
        when(evaluationRepository.findById(1L)).thenReturn(Optional.of(evaluation));
        
        // Act
        var result = evaluationService.getEvaluationById(1L);
        
        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getEvaluationById_NonExistingId_ThrowsException() {
        // Arrange
        when(evaluationRepository.findById(999L)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            evaluationService.getEvaluationById(999L);
        });
    }
    
    // Add more test methods for other service methods
}