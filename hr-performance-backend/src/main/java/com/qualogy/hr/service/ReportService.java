// ReportService.java
package com.qualogy.hr.service;

import com.qualogy.hr.dto.response.EmployeePerformanceReport;
import com.qualogy.hr.dto.response.EvaluationSummaryReport;
import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.Department;
import com.qualogy.hr.model.enums.EvaluationStatus;
import com.qualogy.hr.model.enums.SkillLevel;
import com.qualogy.hr.repository.EvaluationRepository;
import com.qualogy.hr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private UserRepository userRepository;

    public EvaluationSummaryReport generateSummaryReport(LocalDate startDate, LocalDate endDate) {
        List<Evaluation> evaluations = evaluationRepository.findByCreatedAtBetween(
                startDate.atStartOfDay(),
                endDate.plusDays(1).atStartOfDay()
        );

        EvaluationSummaryReport report = new EvaluationSummaryReport();
        report.setTotalEvaluations((long) evaluations.size());
        
        long completedCount = evaluations.stream()
                .filter(Evaluation::isFinalized)
                .count();
        report.setCompletedEvaluations(completedCount);
        report.setPendingEvaluations(report.getTotalEvaluations() - completedCount);
        
        // Calculate average score
        double avgScore = evaluations.stream()
                .filter(Evaluation::isFinalized)
                .flatMap(e -> e.getCategoryScores().stream())
                .mapToDouble(cs -> cs.getScore() != null ? cs.getScore() : 0)
                .average()
                .orElse(0.0);
        report.setAverageScore(avgScore);
        
        // Group by department
        Map<Department, List<Evaluation>> byDepartment = evaluations.stream()
                .filter(e -> e.getEmployee().getDepartment() != null)
                .collect(Collectors.groupingBy(e -> e.getEmployee().getDepartment()));
        
        Map<Department, EvaluationSummaryReport.DepartmentSummary> departmentSummaries = new HashMap<>();
        byDepartment.forEach((dept, deptEvals) -> {
            long deptTotal = deptEvals.size();
            long deptCompleted = deptEvals.stream().filter(Evaluation::isFinalized).count();
            double deptAvgScore = deptEvals.stream()
                    .filter(Evaluation::isFinalized)
                    .flatMap(e -> e.getCategoryScores().stream())
                    .mapToDouble(cs -> cs.getScore() != null ? cs.getScore() : 0)
                    .average()
                    .orElse(0.0);
            
            departmentSummaries.put(dept, EvaluationSummaryReport.DepartmentSummary.builder()
                    .totalEmployees((long) deptEvals.stream().map(e -> e.getEmployee().getId()).distinct().count())
                    .completedEvaluations(deptCompleted)
                    .averageScore(deptAvgScore)
                    .build());
        });
        report.setDepartmentSummaries(departmentSummaries);
        
        // Group by skill level
        Map<SkillLevel, List<Evaluation>> bySkillLevel = evaluations.stream()
                .filter(e -> e.getEmployee().getSkillLevel() != null)
                .collect(Collectors.groupingBy(e -> e.getEmployee().getSkillLevel()));
        
        Map<SkillLevel, EvaluationSummaryReport.SkillLevelSummary> skillLevelSummaries = new HashMap<>();
        bySkillLevel.forEach((level, levelEvals) -> {
            long levelTotal = levelEvals.size();
            long levelCompleted = levelEvals.stream().filter(Evaluation::isFinalized).count();
            double levelAvgScore = levelEvals.stream()
                    .filter(Evaluation::isFinalized)
                    .flatMap(e -> e.getCategoryScores().stream())
                    .mapToDouble(cs -> cs.getScore() != null ? cs.getScore() : 0)
                    .average()
                    .orElse(0.0);
            
            skillLevelSummaries.put(level, EvaluationSummaryReport.SkillLevelSummary.builder()
                    .totalEmployees((long) levelEvals.stream().map(e -> e.getEmployee().getId()).distinct().count())
                    .completedEvaluations(levelCompleted)
                    .averageScore(levelAvgScore)
                    .build());
        });
        report.setSkillLevelSummaries(skillLevelSummaries);
        
        return report;
    }

    public List<EmployeePerformanceReport> generateEmployeePerformanceReport(Long employeeId, LocalDate startDate, LocalDate endDate) {
        List<Evaluation> evaluations;
        if (employeeId != null) {
            evaluations = evaluationRepository.findByEmployeeIdAndCreatedAtBetween(
                    employeeId,
                    startDate.atStartOfDay(),
                    endDate.plusDays(1).atStartOfDay()
            );
        } else {
            evaluations = evaluationRepository.findByCreatedAtBetween(
                    startDate.atStartOfDay(),
                    endDate.plusDays(1).atStartOfDay()
            );
        }

        // Group evaluations by employee
        Map<User, List<Evaluation>> evaluationsByEmployee = evaluations.stream()
                .collect(Collectors.groupingBy(Evaluation::getEmployee));

        List<EmployeePerformanceReport> reports = new ArrayList<>();
        
        // Calculate ranks
        Map<Long, Double> employeeScores = new HashMap<>();
        Map<Long, Department> employeeDepartments = new HashMap<>();
        
        evaluationsByEmployee.forEach((employee, empEvals) -> {
            double avgScore = empEvals.stream()
                    .filter(Evaluation::isFinalized)
                    .flatMap(e -> e.getCategoryScores().stream())
                    .mapToDouble(cs -> cs.getScore() != null ? cs.getScore() : 0)
                    .average()
                    .orElse(0.0);
            employeeScores.put(employee.getId(), avgScore);
            employeeDepartments.put(employee.getId(), employee.getDepartment());
        });
        
        // Calculate ranks
        Map<Long, Integer> ranks = calculateRanks(employeeScores);
        Map<Department, Map<Long, Integer>> departmentRanks = calculateDepartmentRanks(employeeScores, employeeDepartments);
        
        // Generate reports
        evaluationsByEmployee.forEach((employee, empEvals) -> {
            EmployeePerformanceReport report = new EmployeePerformanceReport();
            report.setEmployeeId(employee.getId());
            report.setEmployeeName(employee.getFullName());
            report.setDepartment(employee.getDepartment() != null ? employee.getDepartment().name() : null);
            report.setSkillLevel(employee.getSkillLevel() != null ? employee.getSkillLevel().name() : null);
            
            List<EmployeePerformanceReport.EvaluationScore> evalScores = empEvals.stream()
                    .map(eval -> {
                        EmployeePerformanceReport.EvaluationScore score = 
                                new EmployeePerformanceReport.EvaluationScore();
                        score.setEvaluationId(eval.getId());
                        score.setEvaluationPeriod(eval.getEvaluationPeriod());
                        score.setEvaluationDate(eval.getCreatedAt().toLocalDate());
                        score.setStatus(eval.getStatus().name());
                        score.setEvaluatorName(eval.getEvaluator().getFullName());
                        
                        // Calculate total score for this evaluation
                        double totalScore = eval.getCategoryScores().stream()
                                .mapToDouble(cs -> cs.getScore() != null ? cs.getScore() : 0)
                                .average()
                                .orElse(0.0);
                        score.setTotalScore(totalScore);
                        
                        return score;
                    })
                    .collect(Collectors.toList());
            
            report.setEvaluationScores(evalScores);
            
            // Calculate average score
            double avgScore = evalScores.stream()
                    .mapToDouble(EmployeePerformanceReport.EvaluationScore::getTotalScore)
                    .average()
                    .orElse(0.0);
            report.setAverageScore(avgScore);
            
            // Set ranks
            report.setRankInCompany(ranks.getOrDefault(employee.getId(), 0));
            if (employee.getDepartment() != null) {
                report.setRankInDepartment(
                        departmentRanks.getOrDefault(employee.getDepartment(), new HashMap<>())
                                .getOrDefault(employee.getId(), 0)
                );
            }
            
            // Calculate category averages
            Map<String, Double> categoryAverages = new HashMap<>();
            empEvals.stream()
                    .filter(Evaluation::isFinalized)
                    .flatMap(e -> e.getCategoryScores().stream())
                    .collect(Collectors.groupingBy(
                            cs -> cs.getCategoryName() != null ? cs.getCategoryName() : "Uncategorized",
                            Collectors.averagingDouble(cs -> cs.getScore() != null ? cs.getScore() : 0)
                    ))
                    .forEach((category, avg) -> categoryAverages.put(category, avg));
            
            report.setCategoryAverages(categoryAverages);
            
            reports.add(report);
        });
        
        // Sort by average score descending
        reports.sort((r1, r2) -> Double.compare(r2.getAverageScore(), r1.getAverageScore()));
        
        return reports;
    }
    
    private Map<Long, Integer> calculateRanks(Map<Long, Double> employeeScores) {
        // Sort employees by score descending
        List<Map.Entry<Long, Double>> sorted = new ArrayList<>(employeeScores.entrySet());
        sorted.sort((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()));
        
        // Assign ranks
        Map<Long, Integer> ranks = new HashMap<>();
        int rank = 1;
        for (Map.Entry<Long, Double> entry : sorted) {
            ranks.put(entry.getKey(), rank++);
        }
        return ranks;
    }
    
    private Map<Department, Map<Long, Integer>> calculateDepartmentRanks(
            Map<Long, Double> employeeScores, 
            Map<Long, Department> employeeDepartments) {
        
        // Group employees by department
        Map<Department, List<Long>> employeesByDept = new HashMap<>();
        employeeDepartments.forEach((empId, dept) -> {
            if (dept != null) {
                employeesByDept.computeIfAbsent(dept, k -> new ArrayList<>()).add(empId);
            }
        });
        
        // Calculate ranks within each department
        Map<Department, Map<Long, Integer>> departmentRanks = new HashMap<>();
        employeesByDept.forEach((dept, empIds) -> {
            // Get scores for employees in this department
            Map<Long, Double> deptScores = empIds.stream()
                    .collect(Collectors.toMap(
                            empId -> empId,
                            empId -> employeeScores.getOrDefault(empId, 0.0)
                    ));
            
            //