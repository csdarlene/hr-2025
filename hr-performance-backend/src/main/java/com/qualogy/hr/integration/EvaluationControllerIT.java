// EvaluationControllerIT.java
package com.qualogy.hr.integration;

import com.qualogy.hr.HrPerformanceSystemApplication;
import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.EvaluationStatus;
import com.qualogy.hr.model.enums.EvaluationType;
import com.qualogy.hr.repository.EvaluationRepository;
import com.qualogy.hr.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = HrPerformanceSystemApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class EvaluationControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private UserRepository userRepository;

    private Evaluation testEvaluation;

    @BeforeEach
    void setUp() {
        // Create test users
        User employee = new User();
        employee.setUsername("testemployee");
        employee.setEmail("employee@test.com");
        employee.setPassword("password");
        employee = userRepository.save(employee);

        User evaluator = new User();
        evaluator.setUsername("testevaluator");
        evaluator.setEmail("evaluator@test.com");
        evaluator.setPassword("password");
        evaluator = userRepository.save(evaluator);

        // Create test evaluation
        testEvaluation = new Evaluation();
        testEvaluation.setEmployee(employee);
        testEvaluation.setEvaluator(evaluator);
        testEvaluation.setType(EvaluationType.TEAM_LEAD_EVALUATION);
        testEvaluation.setStatus(EvaluationStatus.DRAFT);
        testEvaluation.setEvaluationPeriod("Q1 2025");
        testEvaluation.setDueDate(LocalDate.now().plusDays(30));
        testEvaluation = evaluationRepository.save(testEvaluation);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getEvaluation_ExistingId_ReturnsEvaluation() throws Exception {
        mockMvc.perform(get("/api/evaluations/{id}", testEvaluation.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testEvaluation.getId().intValue())))
                .andExpect(jsonPath("$.evaluationPeriod", is("Q1 2025")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getEvaluation_NonExistingId_ReturnsNotFound() throws Exception {
        mockMvc.perform(get("/api/evaluations/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createEvaluation_ValidRequest_ReturnsCreated() throws Exception {
        String requestBody = """
            {
                "employeeId": 1,
                "evaluatorId": 2,
                "type": "SELF_EVALUATION",
                "evaluationPeriod": "Q2 2025",
                "dueDate": "2025-06-30"
            }
            """;

        mockMvc.perform(post("/api/evaluations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.evaluationPeriod", is("Q2 2025")));
    }

    // Add more test methods for other endpoints
}