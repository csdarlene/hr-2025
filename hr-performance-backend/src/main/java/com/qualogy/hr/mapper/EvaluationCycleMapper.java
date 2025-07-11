// EvaluationCycleMapper.java
package com.qualogy.hr.mapper;

import com.qualogy.hr.dto.request.EvaluationCycleRequest;
import com.qualogy.hr.dto.response.EvaluationCycleResponse;
import com.qualogy.hr.model.EvaluationCycle;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface EvaluationCycleMapper {
    EvaluationCycleMapper INSTANCE = Mappers.getMapper(EvaluationCycleMapper.class);
    
    EvaluationCycle toEntity(EvaluationCycleRequest dto);
    
    EvaluationCycleResponse toDto(EvaluationCycle evaluationCycle);
}