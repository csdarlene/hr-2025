// EvaluationMapper.java
package com.qualogy.hr.mapper;

import com.qualogy.hr.dto.request.EvaluationRequest;
import com.qualogy.hr.dto.response.EvaluationResponse;
import com.qualogy.hr.model.Evaluation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {UserMapper.class, EvaluationCycleMapper.class})
public interface EvaluationMapper {
    EvaluationMapper INSTANCE = Mappers.getMapper(EvaluationMapper.class);
    
    @Mapping(target = "employee", source = "employeeId")
    @Mapping(target = "evaluator", source = "evaluatorId")
    @Mapping(target = "evaluationCycle", source = "evaluationCycleId")
    Evaluation toEntity(EvaluationRequest dto);
    
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", expression = "java(evaluation.getEmployee().getFullName())")
    @Mapping(target = "evaluatorId", source = "evaluator.id")
    @Mapping(target = "evaluatorName", expression = "java(evaluation.getEvaluator().getFullName())")
    @Mapping(target = "evaluationCycleId", source = "evaluationCycle.id")
    EvaluationResponse toDto(Evaluation evaluation);
}

